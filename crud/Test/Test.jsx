import React from 'react'
import {connect} from 'react-redux'
import {Modal} from 'react-bootstrap'
import Loading from 'components/utils/Loading.jsx'
import Datatable from 'components/tables/Datatable.jsx'
import WidgetGrid from 'components/layout/widgets/WidgetGrid.jsx'
import JarvisWidget from 'components/layout/widgets/JarvisWidget.jsx'
import utils from "app/utils"
import api from 'app/utils/api'
import Access, {hasAccess} from 'app/pages/user/Access'
// 页面交互相关
import TestEditModal from './TestEditModal.jsx'
import m from './test.js'

export class Test extends React.Component {
    constructor(props){
        super(props);
        this.options = {unMount: false};
        this.state = {
            table_info: {
                cn_title: "账号列表",
                data_th: ["编号","名称","权限分组","创建时间","更多操作"],
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
            this.refreshData();
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

    checkCluster() {
        if (!this.state.cluster) {
            $.SmartMessageBox({
                title: "请先选择集群信息。",
                content: '',
                buttons: '[确认]'
            });
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
        one = one[0]
        this.showModal(one)
    }

    del(id) {
        
        if(!this.checkCluster()) return
        
        // TODO
        return m.del(this.state.cluster, id)
            .then(this.retrieveAll)
    }

    retrieveAll () {
        this.setState({table_data: [], loadingStatus: true});
        return m.getAll()
            .then((respData) => {
                this.setState({
                    data: respData.data,
                    table_data: respData.data,
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
        // api.abort();
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        let {hasAccess, user} = this.props
        let list = [], body = this.state.modalBody;

        let table_dataSet = [];
        let name = ''
        let status = '上线运行中'
        let actions = '';
        let table = '';
        let count = this.state.table_data.length
        if (count > 0) {
            $.each(this.state.table_data, function (k, v) {

                let accessType = '';

                switch (v.AccessType) {
                    case 1:
                        accessType = '超级管理员';
                        actions = '';
                        break;
                    case 2:
                        accessType = '管理员';
                        break;
                    case 4:
                        accessType = "销售人员";
                        break;
                    default:
                        accessType = '用户';
                        break;
                }
                actions = ``;
                if (v.AccessType > user.AccessType) {
                    hasAccess("EVA_USER_PUT") && (actions += `<a href="javascript:void(0)" class="btn btn-default ml_10 edit" data-name=${v.Id}>编辑</a>`)
                    hasAccess("EVA_USER_DELETE") && (actions += `<a href="javascript:void(0)" class="btn btn-danger ml_10 del" data-name=${v.Id}>删除</a>`)
                    table_dataSet.push([v.Id, v.Name, accessType, v.CreateTime, actions])
                }else if(utils.getCookie("cuserName") === v.Name){
                    hasAccess("EVA_USER_PUT") && (actions += `<a href="javascript:void(0)" class="btn btn-default ml_10 edit" data-name=${v.Id}>编辑</a>`)
                    table_dataSet.push([v.Id, v.Name, accessType, v.CreateTime, actions])
                }
            });
            table = <Datatable
                options={{
                    data: table_dataSet,
                    columns: [
                        {title: this.state.table_info.data_th[0]},
                        {title: this.state.table_info.data_th[1]},
                        {title: this.state.table_info.data_th[2]},
                        {title: this.state.table_info.data_th[3]},
                        {title: this.state.table_info.data_th[4]},
                    ]
                }}
                paginationLength={true}
                className="table table-striped table-bordered table-hover"
                width="100%"
                funcs={
                    [
                        ["a.edit", this.edit], //编辑
                        ["a.del", this.del], //删除
                    ]

                }>
            </Datatable>
        }
        list.push(
            <WidgetGrid key="0">
                <div className="row">
                    <article className="col-sm-12">
                        <JarvisWidget editbutton={false} fullscreenbutton={false} colorbutton={false}
                                      togglebutton={false}
                                      deletebutton={false}>
                            <header><span className="widget-icon"> <i className="fa fa-table"/> </span>
                                <h2>{this.state.table_info.cn_title}</h2>
                                <div className="widget-toolbar">
                                    <Access id="EVA_USER_POST">
                                        <a href-void
                                           className="btn btn-danger btn-lg"
                                           onClick={this.createApp} style={{fontSize: '12px'}}>
                                            <i className="fa fa-plus"/>
                                            创建账户
                                        </a>
                                    </Access>
                                </div>
                            </header>
                            <div>
                                <div className="widget-body no-padding">
                                    <Access id="EVA_USER_GET">
                                        {table}
                                    </Access>
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>
            </WidgetGrid>
        )
        // }

        if (this.state.modalCreateAppShow) {
            body = <EVAEditModal
                mode={this.state.editorMode}
                data={this.state.editorData}
                close={this.hideModal}
            />;
        }

        return (
            <div id="content">
                <Loading show={this.state.loadingStatus}/>
                {list}
                <Modal show={this.state.modalShow}
                       key='1'>
                    <Modal.Header
                        closeButton={true}
                        aria-label={'Close'}
                        onHide={this.hideModal}>
                        <h4 className="modal-title">{this.state.modalTitle}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        {body}
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