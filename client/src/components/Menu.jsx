import React, { Component } from "react";
import { MegaMenu } from 'primereact/megamenu';
import { withRouter } from 'react-router'

export class Menu extends Component{
    
    
    // See http://4youngpadawans.com/primereact-menubar-with-react-router/
    navigateToPage = (path) => {
		this.props.history.push(path);
	}

    render(){
        const items = [
            {
                label: 'Home', icon: 'pi pi-fw pi-home', command:()=>{ this.navigateToPage(process.env.PUBLIC_URL+'/') }, 
            },
            {
                label: 'An einem Benchmark teilnehmen', icon: 'pi pi-fw pi-file-excel', command:()=>{ this.navigateToPage(process.env.PUBLIC_URL+'/participate') }, 
            },
            {
                label: 'Benchmark erstellen', icon: 'pi pi-fw pi-cog', command:()=>{ this.navigateToPage(process.env.PUBLIC_URL+'/create') },
            },
            {
                label: 'Architektur', icon: 'pi pi-fw pi-briefcase', command:()=>{this.navigateToPage(process.env.PUBLIC_URL+'/architecture')}
            },
            {
                label: 'Impressum', icon: 'pi pi-fw pi-users', command:()=>{this.navigateToPage(process.env.PUBLIC_URL+'/imprint')}
            }
        ]
        return(<MegaMenu  model={items} className="p-mb-4" />)
    }
    
}


export default withRouter(Menu)