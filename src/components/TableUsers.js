import axios from "axios";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import { fetchAllUser } from "../service/UserService";
import ModalEdit from "./ModalEdit";
import ModalConfirm from "./ModalConfirm";
import "./TableUser.scss";
import _, { debounce } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";
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

  const [keyword, setKeyword] = useState("");

  const [dataExport, setDataExport] = useState([]);
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

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    // console.log(term);
    if (term) {
      let cloneListUser = _.cloneDeep(listUsers);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term));
      // cloneListUser = _.includes(cloneListUser, item => item);
      setListUsers(cloneListUser);
    } else {
      getAllUser(1);
    }
  }, 300);

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["Id", "Email", "First name", "Last name"]);
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (event) => {
    if (event.target && event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("Only accept csv file...!");
        return;
      } else {
        Papa.parse(file, {
          // header: true,
          complete: function (results) {
            let rawCSV = results.data;
            if (rawCSV.length > 0) {
              if (rawCSV[0] && rawCSV[0].length === 3) {
                if (
                  rawCSV[0][0] !== "email" ||
                  rawCSV[0][1] !== "first_name" ||
                  rawCSV[0][2] !== "last_name"
                ) {
                  toast.error("Wrong format Header CSV file!");
                }
              } else {
                console.log("Finished:", rawCSV);
                let result = [];
                rawCSV.map((item, index) => {
                  if (index > 0 && item.length === 3) {
                    let obj = {};
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                console.log("result", result);
              }
            } else {
              toast.error("Not found data on CSV file!");
            }
            // console.log("Finished:", results.data);
          },
        });
      }
    }

    // Papa.parse(file, {
    //   complete: function(results) {
    //     console.log("Finished:", results.data);
    //   }
    // });
  };
  return (
    <>
      <div className="my-3 add-new">
        <span>
          <b>List users:</b>
        </span>
        <div>
          <label htmlFor="test" className="btn btn-warning">
            {" "}
            <i className="fa-solid fa-file-import mx-1"></i>Import
          </label>
          <input
            id="test"
            type="file"
            hidden
            onChange={(event) => handleImportCSV(event)}
          />

          <CSVLink
            data={dataExport}
            asyncOnClick={true}
            onClick={getUsersExport}
            filename={"users.csv"}
            className="btn btn-primary mx-1"
          >
            <i className="fa-solid fa-file-arrow-down mx-1"></i>Export
          </CSVLink>

          <button
            className="btn btn-success "
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus mx-1"></i>
            Add new
          </button>
        </div>
      </div>
      <div className="col-3 my-3">
        <input
          className="form-control"
          placeholder="Search user by email"
          // value={keyword}
          onChange={(event) => handleSearch(event)}
        />
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
