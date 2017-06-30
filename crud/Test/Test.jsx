import React from 'react'
import {connect} from 'react-redux'
import {Modal} from 'react-bootstrap'
import Loading from 'components/utils/Loading.jsx'
import Datatable from 'components/tables/Datatable.jsx'
import ClusterSelect from "app/pages/utils/ClusterSelect"
import WidgetGrid from 'components/layout/widgets/WidgetGrid.jsx'
import JarvisWidget from 'components/layout/widgets/JarvisWidget.jsx'
import utils from "app/utils"
import api from 'app/utils/api'
import Access, {hasAccess} from 'app/pages/user/Access'
// ------------ custom ------------
import TestEditModal from './TestEditModal.jsx'
import m from './Test.model.js'

export class Test extends React.Component {
    constructor(props){
        super(props);
        this.options = {unMount: false};
        this.state = {
            table_info: {
                cn_title: "异常列表",
                data_th: ["编号","异常时间","更多操作"],
            },
            data:[],
            table_data: [],
            loadingStatus: false,
            modalShow: false,
            modalTitle: '',
            modalFooterShow: true,
            modalConfirm: this.hideModal,
            modalCreateAppShow: false,
            editorMode: 0,
            editorData: null
        }

        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.create = this.create.bind(this)
        this.retrieveAll = this.retrieveAll.bind(this)
        this.update = this.update.bind(this)
        this.del = this.del.bind(this)
    }

    // ---------------actions------------
    hideModal(refresh) {
        this.setState({
            modalShow: false,
            editorMode: 0,
            editorData: null,
            modalCreateAppShow: false
        });
        if (refresh) {
            this.retrieveAll();
        }
    }

    showModal(data) {
        let st = {
            modalShow: true,
            modalCreateAppShow: true,
        }
        if(data) {
            st.editorMode = 1
            st.editorData = data
        }
        this.setState(st)
    }
    
    onClusterChange (cluster) {
        this.setState({cluster: cluster}, () => {
            if(cluster) {
                this.retrieveAll()
            } else {
                this.setState({table_data: [], loadingStatus: false})
            }
        })
    }

    checkCluster(withMessage) {
        if (!this.state.cluster) {
            if(withMessage) {
                $.SmartMessageBox({
                    title: "请先选择集群信息。",
                    content: '',
                    buttons: '[确认]'
                });
            }
            return false
        }
        return true
    }
    

    // ---------------crud------------
    create() {
        if(!this.checkCluster()) return

        this.showModal()
    }

    update(id) {
        if(!this.checkCluster()) return
        let one = this.state.data.filter((v) => v.Id == id)
        if(one.length == 0 ) {
            return
        }
        this.showModal(one[0])
    }

    del(id) {
        if(!this.checkCluster()) return
        return m.del(this.state.cluster, id)
            .then(this.retrieveAll)
    }

    retrieveAll () {
        if(!this.checkCluster(false)) return
        
        this.setState({table_data: [], loadingStatus: true});
        return m.getAll(this.state.cluster)
            .then((respData) => {
                // console.log(respData)
                let rtn = respData
                if (rtn.status != 200) {
                    return Promise.reject(rtn.msg)
                }
                this.setState({
                    data: rtn.data || [],
                    table_data: rtn.data || [],
                    loadingStatus: false
                });
            })
            .catch(() => {
                this.setState({
                    loadingStatus: false
                });
            })
    }

    // ---------------lifecycle------------
    componentDidMount() {
        this.retrieveAll()
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    renderCluster() {
        return (
            <section id="widget-grid">
                <div className="well clearfix">
                    <div className="col-sm-3 col-md-3">
                        <ClusterSelect className="form-control select  col" cluster_type="bigdata"
                                        onChange={(e) => {
                                            this.onClusterChange(e.target.value)
                                        }}/>
                    </div>
                </div>
            </section>
        )
    }

    renderTableHeader() {
        return (
            <header><span className="widget-icon"> <i className="fa fa-table"/> </span>
                <h2>{this.state.table_info.cn_title}</h2>
                <div className="widget-toolbar">
                        <a href-void
                            className="btn btn-danger btn-lg"
                            onClick={this.create} style={{fontSize: '12px'}}>
                            <i className="fa fa-plus"/>
                            创建账户
                        </a>
                </div>
            </header>
        )
    }

    renderTableData() {
        let count = this.state.table_data.length
        let table_dataSet = [];
        if(count == 0) return null

        $.each(this.state.table_data, function (k, v) {

            let actions = ``;
            actions += `<a href="javascript:void(0)" class="btn btn-default ml_10 edit" data-name=${v.Id}>编辑</a>`
            actions += `<a href="javascript:void(0)" class="btn btn-danger ml_10 del" data-name=${v.Id}>删除</a>`
            table_dataSet.push([
                v['Id'],
                v['ErrorDate'],
                actions
            ])
        });

        return table_dataSet
    }

    renderTable(data) {
        if(!data) return null;
        return (
            <Datatable
                options={{
                    data: data,
                    columns: [
                        {title: this.state.table_info.data_th[0]},
                        {title: this.state.table_info.data_th[1]},
                        {title: this.state.table_info.data_th[2]},
                    ]
                }}
                paginationLength={true}
                className="table table-striped table-bordered table-hover"
                width="100%"
                funcs={
                    [
                        ["a.edit", this.update], 
                        ["a.del", this.del],                     
                    ]
                }>
            </Datatable>
        )
    }

    render() {
        let {hasAccess, user} = this.props
        let {modalBody, modalTitle, loadingStatus, modalShow} = this.state
        let content = this.renderTable(this.renderTableData())
        let header = this.renderTableHeader()
        let cluster = this.renderCluster()

        if (this.state.modalCreateAppShow) {
            modalBody = <TestEditModal
                mode={this.state.editorMode}
                data={this.state.editorData}
                cluster={this.state.cluster}
                close={this.hideModal}
            />;
        }

        return (
            <div id="content">
                <Loading show={loadingStatus}/>
                {cluster}
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget editbutton={false} fullscreenbutton={false} colorbutton={false}
                                        togglebutton={false}
                                        deletebutton={false}>
                                {header}
                                <div>
                                    <div className="widget-body no-padding">
                                        {content}
                                    </div>
                                </div>
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
                <Modal show={modalShow}
                       key='1'>
                    <Modal.Header
                        closeButton={true}
                        aria-label={'Close'}
                        onHide={this.hideModal}>
                        <h4 className="modal-title">{modalTitle}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        {modalBody}
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        I18N: state.i18n.locale && state.i18n.translations && state.i18n.translations[state.i18n.locale] || {},
        user: state.login.user,
        hasAccess: (id) => hasAccess(state, id)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const ConnectedTest = connect(mapStateToProps, mapDispatchToProps)(Test)

export default ConnectedTest