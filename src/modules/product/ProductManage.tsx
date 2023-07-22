/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from "react";
import DashboardLayout from "../dashboard/DashboardLayout";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Table } from "../../components/table";
import { IconDelete, IconEdit } from "../../components/icons";
import { Button } from "../../components/button";
import { deleteProduct, getAllProduct } from "../../api/product";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Tproduct } from "../../types/product";
import ReactPaginate from "react-paginate";
import formatPrice from "../../utils/fomatPrice";
const ProductManage = () => {
  const [product, setProduct] = useState([]);
  const [url, setUrl] = useState("/products");
  const [pageCount, setPageCount] = useState(0);
  const navigate = useNavigate();
  const handlePageClick = (event: any) => {
    const page = event.selected + 1;
    setUrl(`/products?page=${page}`);
    console.log(url);
  };
  useEffect(() => {
    loadData();
  }, [url]);

  const loadData = () => {
    void getAllProduct(url).then(({ data }) => {
      setProduct(data?.product);
      setPageCount(Math.ceil(data?.totalPage));
    });
  };

  const handleRemove = (id: any) => {
    void Swal.fire({
      title: "Bạn muốn xoá sản phẩm này?",
      text: "Thao tác này sẽ khiến sản phẩm bị xoá vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          void (await deleteProduct(id).then(() => {
            void loadData();
            void Swal.fire(
              "Deleted!",
              "Your file has been deleted.",
              "success"
            );
          }));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <DashboardLayout>
      <DashboardHeading title="Products" desc="Manage all products">
        <Button type="button" to="/manage/add-product" className="h-[55px]">
          + Create Product
        </Button>
      </DashboardHeading>
      <Table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {product?.map((item: Tproduct, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="max-w-[70px] object-cover"
                />
              </td>
              <td className="font-bold">{item?.name}</td>
              <td>
                <em className="text-red-500">{formatPrice(item?.price)} đ</em>
              </td>
              <td>
                <div className="flex items-center gap-x-3 text-primary">
                  <IconEdit
                    onClick={() => navigate(`/manage/edit-product/${item._id}`)}
                  ></IconEdit>
                  <IconDelete
                    onClick={() => handleRemove(item?._id)}
                  ></IconDelete>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="py-10">
        <ReactPaginate
          hrefBuilder={() => {
            return "#";
          }}
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageCount={pageCount}
          disableInitialCallback={true}
          previousLabel="<"
          renderOnZeroPageCount={null}
          className="mb-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-[6px] text-[15px] text-[#ececec] lg:gap-x-3 lg:text-base lg:mb-0 "
          pageLinkClassName="bg-[#222222] bg-opacity-80 page-link transition-all hover:bg-opacity-100 py-1 px-2 rounded-[5px]"
          previousClassName="bg-[#222222] bg-opacity-80  transition-all hover:bg-opacity-100 py-1 px-2 rounded-[5px]"
          nextClassName="bg-[#222222] nextPage bg-opacity-80  transition-all hover:bg-opacity-100 py-1 px-2 rounded-[5px]"
          activeClassName="page-active text-primary"
          disabledClassName="opacity-40"
          disabledLinkClassName="hover:cursor-default"
        />
      </div>
    </DashboardLayout>
  );
};

export default ProductManage;
