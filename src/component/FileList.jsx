
import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
// import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome'
import axios from 'axios';


export default class FileList extends Component {
    constructor(props) {
        super(props);
        this.initState = {
            fileList: [],
        };
        this.state = this.origialState()();

        this.fileRoot = '';
        
        this.history = [];
    }
    origialState() {
        return () => ({
            fileList: [],
            currentPath: '/',
        })
    }
    resetState() {
        this.setState(this.origialState()());
    }
    backHandle() {
        return () => {
            if (this.history.length) {
                let url = this.history.pop();

                if (url === '/') {
                    return;
                }
                this.fetchList(url, true);
            }
        }
    }
    async fetchRoot() {
        let { data } = await axios.get(`${window.location.origin}/get_root`);
        // this.setState({
        //     fileList: data
        // })
        this.fileRoot = data.root || '';
        return Promise.resolve();
    }
    async fetchList(path, backMode) {
        
        let { data } = await axios.post(`${window.location.origin}/path`, {
            path,
        });
        this.setState((prevState) => {
            if (!backMode) {
                this.history.push(prevState.currentPath);
            }
            return {
                currentPath: path,
                fileList: data,
            }
            
        })
        
        return Promise.resolve();
    }
    async viewFile(path) {
        // window.open(`${window.location.origin}/file?path=${path}`);
        window.location.href = `/file?path=${path}`;
        
        return Promise.resolve();
    }
    get fullPath() {
        return `${this.state.currentPath}`;
    }
    get listItems() {
        return this.state.fileList
        .sort((a, b) => {
            if (!a.isDir && b.isDir) {
                return 1;
            } else if (a.isDir && b.isDir) {
                return 0;
            } else {
                return -1;
            }
        })
        .map(({
            filename,
            path,
            isFile,
            isDir,
            birthtime,
            ctime,
            size,
        }) => {
            // let icon;
            let operationBtn;
            if (isFile) {
                // icon = <FontAwesomeIcon icon="file" />;
                operationBtn = <Button color="link" onClick={ (e) => this.viewFile(path) }>{ filename }</Button>
            } else if (isDir) {
                // icon = <FontAwesomeIcon icon="folder" />;
                operationBtn = <Button  color="secondary" onClick={ (e) => this.fetchList(path) }>{ filename }</Button>
                filename += '/'
            }

            return (
                <tr>
                    <td>{ operationBtn }</td>
                    <td>{ size }</td>
                    <td>{ new Date(birthtime).toLocaleDateString() }</td>
                    <td>{ new Date(ctime).toLocaleDateString() }</td>
                </tr>
            )
        })
    }
    render() {
        return (
            <div className="App-content">
                <h3 className="align-center nav-dirname">Path: { this.fullPath }</h3>
                <div className="align-center">
                    <Button className="back-btn" onClick={ this.backHandle() }>后退</Button>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <td>文件(夹)名</td>
                            <td>大小</td>
                            <td>创建时间</td>
                            <td>改动时间</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.listItems }
                    </tbody>
                </Table>
            </div>
        )
    }
    async componentDidMount() {
        await this.fetchRoot();
        await this.fetchList(this.fileRoot);
    }
}
