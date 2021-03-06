import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Relay from 'react-relay'
import { Link } from 'react-router'
import NoContent from 'ui/shared/components/NoContent'
import {
  Table,
  TableHeaderColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table'

import ActionDelete from 'material-ui/svg-icons/action/delete'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Pagination from 'ui/backend/components/shared/Pagination'
import inlineStyles from 'ui/shared/styles/MaterialUI'

import { getNewsPosts, deleteNewsPost } from 'store/actions/newspost'
import { setToast } from 'store/actions/common'

import * as authSelectors from 'store/selectors/auth'
import * as newspostSelectors from 'store/selectors/newspost'


const mapStateToProps = (state) => ({  
  newsposts: newspostSelectors.getNewsPosts(state),
  token: authSelectors.getToken(state),
})

@connect(mapStateToProps, { getNewsPosts, setToast, deleteNewsPost })
export default class NewsPostIndex extends Component {

  componentDidMount() {
    document.title = 'NewsPost Management'
    this._handleMovePage(1)
  }

  _handleMovePage = (page) => {
    if(page){
      this.page = page
    }    
    this.props.getNewsPosts(this.page)
  }

  _handleRemove = (id) => {
    // allow callback function
    this.props.deleteNewsPost(this.props.token, id, (data)=>{
      this.props.setToast('delete newspost successfully!!!')
      this._handleMovePage()
    }, (error)=> this.props.setToast('delete newspost failed!!!'))
  }

  renderRow(row) {

    const {id, title, description, updated_at} = row

    return (
      <TableRow key={id} style={inlineStyles.row}>        
        <TableRowColumn colSpan="2" style={inlineStyles.rowColumn} >
          {title}
        </TableRowColumn>
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >
          {description}
        </TableRowColumn>
        <TableRowColumn colSpan="2" style={inlineStyles.rowColumn} >
          {updated_at}
        </TableRowColumn>
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >          
          <Link to={`/admin/newsposts/${id}/edit`}>
            <IconButton disableTouchRipple >
              <EditorModeEdit />
            </IconButton>
          </Link>          
          <IconButton
            name="delete-button"
            onClick={e=>this._handleRemove(id)}
            disableTouchRipple
          >
            <ActionDelete/>
          </IconButton>
        </TableRowColumn>
      </TableRow>
    )
  }

  render() {

    const {newsposts:{rows=[], count=0, offset=0} } = this.props
    const newButton = (
      <Link to="/admin/newsposts/new">
        <FloatingActionButton style={inlineStyles.floatButton} disableTouchRipple={true}>
          <ContentAdd />
        </FloatingActionButton>
      </Link>
    )    

    return (
      <section>
       {newButton}
        <h1>Sell Post</h1>
        <Table fixedHeader fixedFooter>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow selectable={false}>              
              <TableHeaderColumn colSpan="2" style={inlineStyles.headerColumn}>
                Title
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Description
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="2" style={inlineStyles.headerColumn}>
                Updated Date
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Action
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
           
          {rows.map(row => this.renderRow(row))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn>                

                <Pagination
                  offset={offset}
                  total={count}
                  limit={10}
                  handlePageClick={this._handleMovePage}
                />
              
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    )
  }
}
