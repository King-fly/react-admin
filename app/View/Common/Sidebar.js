import React from 'react';
import MenuItem from './MenuItem.js';

class Sidebar extends React.Component {
    render() {
        const menuViews = this.props.menuViews.children()
            .map((menu, i) => <MenuItem key={i} menu={menu} />);

        return (
            <div className="navbar-default sidebar" role="navigation">
                <div className="sidebar-nav navbar-collapse">
                    <ul className="nav" id="side-menu">
                        {menuViews}
                    </ul>
                </div>
            </div>
        )
    }
}

require('../../autoloader')('Sidebar', Sidebar);

export default Sidebar;
