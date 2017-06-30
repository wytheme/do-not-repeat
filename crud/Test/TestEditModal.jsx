import React from 'react'
import {connect} from 'react-redux'
import BootstrapValidator from 'components/forms/validation/BootstrapValidator.jsx'
import api from 'app/utils/api'
import bigdata from 'app/utils/bigdata'
import utils from "app/utils"
import _ from "lodash"
import m from './Test.model.js'


let TestEditModal = React.createClass({

    getInitialState: function () {
        return {
            regMod: '',
            confirm: false,
            validatorOptions: {
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    ErrorDate: {
                        validators: {
                            notEmpty: {
                                message: "异常日期不能为空"
                            },
                        }
                    },
                }
            }
        }
    },

    _onSubmit: function (e) {
        let confirm = this.state.confirm
        let dataBody = {}
        if (!confirm) return
        
        let pErrorDate = this.refs["ErrorDate"].value
        if (!pErrorDate) return 
        dataBody["ErrorDate"] = pErrorDate


        if (this.props.mode > 0) {
            let id = this.props.data.Id
            return m.update(this.props.cluster,id, dataBody)
                .then(() => this.props.close(true))
                .catch(() => this.props.close(false))
        } else {
            return m.create(this.props.cluster,dataBody)
                .then(() => this.props.close(true))
                .catch(() => this.props.close(false))
        }
        
    },

    componentWillUnmount: function () {
        if (this.serverRequest)
            this.serverRequest.abort();
    },

    render: function () {
        let data = this.props.data || {}
        let {
            ErrorDate,
        } = data

        // if (this.props.data && this.props.mode > 0) {
        //     date = this.props.data.date
        // }

        return (
            <BootstrapValidator options={this.state.validatorOptions}>

                <form id="productForm" onSubmit={this._onSubmit} className="form-horizontal" action=""
                      target="nm_iframe">
                    <iframe id="id_iframe" name="nm_iframe" className="hide"></iframe>

                    <fieldset>
                        <div className="form-group">
                            <label className="col-xs-2 col-lg-3 control-label">异常日期</label>
                            <div className="col-xs-9 col-lg-6 inputGroupContainer">
                                <div className="input-group">
                                    <input type="text"
                                           className="form-control"
                                           name="ErrorDate"
                                           placeholder="20170606"
                                           defaultValue={ErrorDate}
                                           ref='ErrorDate'/>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <div className="form-actions backgroud-color-white">
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-default" onClick={(e) => {
                                    this.setState({confirm: false});
                                    this.props.close();
                                }}>
                                    取消
                                </button>
                                <button className="btn btn-primary margin-left"
                                        onClick={(e) => {
                                            this._onSubmit()
                                            this.setState({confirm: true});
                                        }}>
                                    {this.props.mode ? "更新" : "创建"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </ BootstrapValidator >
        )
    }
});

const mapStateToProps = (state) => {
    return {
        I18N: state.i18n.locale
        &&
        state.i18n.translations
        &&
        state.i18n.translations[state.i18n.locale] || {},
        user: state.login.user
    }
}

const ConnectedTestEditModal = connect(mapStateToProps)(TestEditModal)

export default ConnectedTestEditModal