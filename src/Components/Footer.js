import React, { Component } from 'react'
import './Footer.css'

class Footer extends Component {

    Copyright = () => {
        return (
            <h2 variant = "body2" color="textSecondary" align="center">
            {'Copyright C '}
            {'SyDropV2'}
            {new Date().getFullYear()}
            {'.'}
        </h2>
        )
    }

    render() {
        return (
            <footer>
                <div className="footer 1-box is-center">
                    {this.Copyright()}
                </div>
            </footer>
        )
    }
}

export default Footer
