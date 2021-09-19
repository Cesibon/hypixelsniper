
import { Component, createRef } from 'react';
import axios from 'axios'
import Grid from './components/Grid'

import './styles/App.css'


export default class App extends Component {
    timeInterval
    constructor(props){
        super(props)
        this.state = {
            data: [],
            update: false
        }
        
        this.fetching = false
        this.update = createRef()

        this.loop = setInterval(this.fetchData.bind(this), 10000)
    }
    render() {
        
        return (
            <div className="App">
                <Grid rowData={this.state.data} ></Grid>
                <span className="bg-light" style={{position: 'absolute', bottom: '0px', right: '20px', padding: '2px'}}>
                    <input type="checkbox" name="update" id="update" onChange={() => this.setState({update: !this.state.update})} /> 
                    <label htmlFor="update">Auto update</label>
                </span>
            </div>
        )
    }


    async fetchData() {
        if(!this.state.update) return

        console.log('Fetching data...')

        this.fetching = true
        const res = await axios.get('/data')
        this.fetching = false

        console.log(res)

        this.setState({data: res.data})
    }
}



