import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { database } from './firebase'
import { map } from './utils'
import * as models from './models'
import * as fields from './fields'
import { LoadingIcon } from './icons'

const modelsByProperty = {}

map(models, (key, model) => {
  modelsByProperty[model.property] = model
})


class Edit extends Component {
  componentWillMount () {
    const model = modelsByProperty[this.props.params.model]
    const { id } = this.props.params

    this.loadEntry(model, id)
  }

  componentDidMount () {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.hasUnsavedChanges) {
        return 'You have unsaved changes.\nLeaving this page will discard these changes.'
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.model !== this.props.params.model || nextProps.params.id !== this.props.params.id) {
      const model = modelsByProperty[nextProps.params.model]
      const { id } = nextProps.props.params

      this.loadEntry(model, id)
    }
  }

  loadEntry (model, id) {
    if (id === 'new') {
      this.setState({
        model: model,
        id: id,
        ref: null,
        isLoading: false,
        hasUnsavedChanges: false,
        entry: {},
      })
      return
    }

    const ref = database.ref(`data/${model.property}/${id}`)

    this.setState({
      model: model,
      id: id,
      ref: ref,
      isLoading: true,
      entry: null,
    })

    ref.off('value')
    ref.once('value', snapshot => {
      this.setState({
        isLoading: false,
        hasUnsavedChanges: false,
        entry: snapshot.val()
      })
    })
  }

  componentWillUnmount () {
    const { ref } = this.state
    if (ref) ref.off('value')
  }

  setProperty (property, value) {
    this.setState({
      hasUnsavedChanges: true,
      entry: {
        ...this.state.entry,
        [property]: value,
      },
    })
  }

  save = (event) => {
    event.preventDefault()

    if (this.state.id === 'new') {
      database.ref(`data/${this.state.model.property}`).push(this.state.entry)
    }
    else {
      this.state.ref.set(this.state.entry)
    }

    this.setState({
      hasUnsavedChanges: false,
    }, () => {
      this.props.router.push(`/content/${this.props.params.model}`)
    })
  }

  render () {
    if (this.state.isLoading) {
      return (
        <p>
          <LoadingIcon />
        </p>
      )
    }

    return (
      <form onSubmit={this.save}>
        {this.state.model.fields.map((field, i) => {
          const Field = fields[field.type] || fields.text
          return <Field key={i} {...field} value={this.state.entry[field.property]} onChange={this.setProperty.bind(this, field.property)} />
        })}
        <button type="submit" className="btn btn-primary btn-lg" disabled={!this.state.hasUnsavedChanges}>Save</button>
      </form>
    )
  }
}

export default withRouter(Edit)

