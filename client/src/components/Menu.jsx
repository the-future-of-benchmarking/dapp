import React, { Component } from "react";
import { MegaMenu } from 'primereact/megamenu';
import { withRouter } from 'react-router'

export class Menu extends Component{
    
    
    // See http://4youngpadawans.com/primereact-menubar-with-react-router/
    navigateToPage = (path) => {
		console.log('Navigate to path ' + path);
		this.props.history.push(path);
	}

    render(){
        console.log(this.props)
        const items = [
            {
                label: 'Home', icon: 'pi pi-fw pi-home', command:()=>{ this.navigateToPage('/') }, 
            },
            {
                label: 'Participate in Benchmark', icon: 'pi pi-fw pi-file-excel', command:()=>{ this.navigateToPage('/participate') }, 
            },
            {
                label: 'Create Benchmark', icon: 'pi pi-fw pi-cog', command:()=>{ this.navigateToPage('/create') },
            }
        ]
        return(<MegaMenu  model={items} className="p-mb-4" />)
    }
    
}


export default withRouter(Menu)