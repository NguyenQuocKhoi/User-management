import axios from "axios";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import { fetchAllUser } from "../service/UserService";
import ModalEdit from "./ModalEdit";
import ModalConfirm from "./ModalConfirm";
import "./TableUser.scss";
import _ from "lodash";

const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIdModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});
  const [dataUserDelete, setDataUserDeletet] = useState({});
  const [isShowModalDelete, setIsModalDelete] = useState(false);

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUsers(cloneListUser);
  };
  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIdModalEdit(false);
    setIsModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };

  useEffect(() => {
    getAllUser(1);
  }, []);

  const getAllUser = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setListUsers(res.data);
      setTotalPages(res.total_pages);
      setTotalUsers(res.total);
    }
  };
  console.log(listUsers);

  const handlePageClick = (event) => {
    getAllUser(+event.selected + 1);
  };

  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIdModalEdit(true);
  };

  const handldeDeleteUser = (user) => {
    setIsModalDelete(true);
    setDataUserDeletet(user);
  };
  const handleEditUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;
    setListUsers(cloneListUser);
  };

  const handldeDeleteUserFormModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    setListUsers(cloneListUser);
  };
  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b>List users:</b>
        </span>
        <button
          className="btn btn-success"
          onClick={() => setIsShowModalAddNew(true)}
        >
          Add new user
        </button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <div className="sort-header">
                <span>Id </span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => {
                      handleSort("desc", "id");
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => {
                      handleSort("asc", "id");
                    }}
                  ></i>
                </span>
              </div>
            </th>
            <th>Email</th>
            <th>
              <div className="sort-header">
                <span>FirstName </span>
                <span>
                  <i
                    className="fa-solid fa-arrow-down-long"
                    onClick={() => {
                      handleSort("desc", "first_name");
                    }}
                  ></i>
                  <i
                    className="fa-solid fa-arrow-up-long"
                    onClick={() => {
                      handleSort("asc", "first_name");
                    }}
                  ></i>
                </span>
              </div>
            </th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item, index) => {
              return (
                <tr key={`user=${index}`}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      className="btn btn-primary mx-3"
                      onClick={() => handleEditUser(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger "
                      onClick={() => {
                        handldeDeleteUser(item);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        // renderOnZeroPageCount={null}/
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />

      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />

      <ModalEdit
        show={isShowModalEdit}
        handleClose={handleClose}
        dataUserEdit={dataUserEdit}
        handleEditUserFromModal={handleEditUserFromModal}
      />

      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        handldeDeleteUserFormModal={handldeDeleteUserFormModal}
        dataUserDelete={dataUserDelete}
      />
    </>
  );
};
export default TableUsers;
