import * as React from "react";
import { Button, Col, Collapse, Row, Table } from "antd";
import { TableProps } from "antd/lib/table";
import { render } from "react-dom";

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable } from 'array-move';

import axios from 'axios';

import "antd/dist/antd.css";
import Modal from "antd/lib/modal/Modal";

const { useState, useEffect } = React;

const SortableItem = SortableElement(props => <tr {...props} />);
const SortableBody = SortableContainer(props => <tbody {...props} />);
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const DataTable = ({ data, myList, remove, add, profs, isLoading, custom, cosubs }) => {
    // const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    // console.log(props.custom)

    useEffect(() => {

        setUserList(data);
    }, [data, myList]);


    const columns = [
        !custom &&
        {
            title: 'Sort',
            dataIndex: 'sort',
            // width: 70,

            className: 'drag-visible',
            render: () => <DragHandle />,
        },
        {
            title: "ID",
            // dataIndex: "professor",
            // width: 70,
            sorter:
                !custom ?
                    null :
                    (a, b) => {
                        return a.order - b.order;
                    },
            render: (text, record, index) => record.order
        },
        !custom &&
        {
            // width: 100,
            title: "Priority",
            // dataIndex: "professor",

            render: (text, record, index) => index + 1
        },
        {
            title: "Professor",
            dataIndex: "professor",
            filters:
                !custom ? null :
                    !profs ? [] :
                        profs.map(x => ({ text: x, value: x })),
            // [
            //     { text: "Amr Abdallah Abou Shousha", value: "Amr Abdallah Abou Shousha" },
            //     { text: "Amr Hussien Elmougy", value: "Amr Hussien Elmougy" }
            // ],
            onFilter: (value, record) => record.professor === value,

        },
        {
            title: "Co-Supervisor",
            dataIndex: "cosupervised",
            filters:
                !custom ? null :
                    !cosubs ? [] :
                        cosubs.map(x => ({ text: x, value: x })),
            // [
            //     { text: "Amr Abdallah Abou Shousha", value: "Amr Abdallah Abou Shousha" },
            //     { text: "Amr Hussien Elmougy", value: "Amr Hussien Elmougy" }
            // ],
            onFilter: (value, record) => record.cosupervised === value,

        },
        {
            title: "Title",
            dataIndex: "title",
            // width: "auto",
            sorter:
                !custom ?
                    null :
                    (a, b) => {
                        if (a.title > b.title)
                            return 1;
                        else return -1;
                    }
            // render: (name) => `${name.first} ${name.last}`,
            // width: "20%"
        },
        {
            // title: "Add to your list",
            render: (text, record) => <Button type="primary" onClick={() => {
                if (custom) {
                    if (myList.includes(record)) {
                        remove(record);
                    }
                    else {
                        add(record);
                    }
                } else {
                    remove(record);
                }
            }}>
                {!custom ? "Remove" : myList.includes(record) ? "Remove" : "Add"}
            </Button>,
        },
        !custom &&
        {
            // title: "Add to your list",
            render: (text, record) => <Button type="primary" onClick={() => {
                // console.log(record.description)
                setModalText(record.description)
                showModal();
                // console.log(props.add)
                
            }}>
                Description
            </Button>,
        }
    ].filter(Boolean);

    const getListOfIDs = (array) => {
        var ids = [];
        array.forEach(element => {
            ids.push(element._id);
        });

        return ids;
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        // const { dataSource } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMoveImmutable([].concat(userList), oldIndex, newIndex).filter(
                el => !!el,
            );
            setUserList(newData);
            localStorage.setObj("list", getListOfIDs(newData));
        }
    };

    const DraggableContainer = props => (
        <SortableBody
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // const { dataSource } = this.state;

        // function findIndex base on Table rowKey props and should always be a right array index
        const index = userList.findIndex(x => x._id === restProps['data-row-key']);


        return <SortableItem index={index} {...restProps}></SortableItem>


    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalText, setModalText] = useState("");

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <div>
            <Modal bodyStyle={{ overflowY: 'scroll', height: '50vh' }} title="Project Description" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                    {modalText ?? "No Description"}

                </p>
            </Modal>
            <Table
                columns={columns}
                dataSource={userList}
                loading={isLoading}
                // onChange={handleTableChange}
                pagination={{ pageSize: custom ? 50 : 250 }}
                // pagination={false}
                expandable={
                    !custom ?
                        null :
                        {
                            expandedRowRender: record => <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{record.description ?? "No description"}</p>,
                        }}
                rowKey="_id"
                // scroll={{ y: 500, x: 500 }}

                components=

                {
                    custom ? null :
                        {
                            body: {
                                wrapper: DraggableContainer,
                                row: DraggableBodyRow,
                            },
                        }}
            />
        </div >
    );
};

export default DataTable;