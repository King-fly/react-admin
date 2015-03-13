import React from 'react';
import {Link} from 'react-router';

class Pagination extends React.Component {
    render() {
        if (this.props.total == 0) {
            return <p className="pagination no-record">No record found.</p>;
        }

        var params = { entity: 'tags' };

        let offsetEnd = Math.min(this.props.page * this.props.perPage, this.props.totalItems);
        let offsetBegin = Math.min((this.props.page - 1) * this.props.perPage + 1, offsetEnd);

        return (
            <nav className="pagination">
                <div className="total">
                    <strong>{offsetBegin}</strong> - <strong>{offsetEnd}</strong> on <strong>{this.props.totalItems}</strong>
                </div>
                <ul role="group" aria-label="pagination">
                    {this._buildPageLinks(params)}
                </ul>
            </nav>
        );
    }

    _buildPageLinks(params) {
        var pages = [];

        if (this.props.page > 1) {
            pages.push(<li><Link to="list" params={params} query={{page: this.props.page * 1 - 1}}>« Prev</Link></li>)
        }

        pages = pages.concat(this._range().map(function(page) {
            if (page == '.') {
                return <li><span>&hellip;</span></li>;
            }

            return <li className={this.props.page == page ? "active" : ""}><Link to="list" params={params} query={{page: page}}>{page}</Link></li>
        }.bind(this)));

        if (this.props.page < this._getNumberPages()) {
            pages.push(<li><Link to="list" params={params} query={{page: this.props.page * 1 + 1}}>Next »</Link></li>)
        }

        return pages;
    }

    _range() {
        let numberPages = this._getNumberPages();
        let currentPage = this.props.page;

        let input = [];

        // display page links around the current page
        if (currentPage > 2) {
            input.push('1');
        }

        if (currentPage == 4) {
            input.push('2');
        }

        if (currentPage > 4) {
            input.push('.');
        }

        if (currentPage > 1) {
            input.push(currentPage - 1);
        }

        input.push(currentPage);

        if (currentPage < numberPages) {
            input.push(currentPage * 1 + 1);
        }

        if (currentPage == (numberPages - 3)) {
            input.push(numberPages - 1);
        }

        if (currentPage < (numberPages - 3)) {
            input.push('.');
        }

        if (currentPage < (numberPages - 1)) {
            input.push(numberPages);
        }

        return input;
    }

    _getNumberPages() {
        return Math.ceil(this.props.totalItems / this.props.perPage) || 1;
    }
}

export default Pagination;
