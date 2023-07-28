/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import DashboardLayout from "../dashboard/DashboardLayout";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Table } from "../../components/table";
import { useEffect, useState } from "react";
import { getAllOrder } from "../../api/order";
import { IconDelete, IconEdit } from "../../components/icons";
import formatPrice from "../../utils/fomatPrice";
import { IUser } from "../../types/User";
import { paymentMethods } from "../../constants/paymentMethods";
import { Paginate } from "../../components/paginate";

interface IOrder {
  paymentMethods: string;
  paymentStatus: string;
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  userId: IUser;
  _id: string;
}

type TOrderResponse = {
  data: {
    orders: IOrder[];
    message: string;
    totalOrder: number;
    totalPage: number;
  };
};

const OrderManage = () => {
  const headings = [
    "STT",
    "Name",
    "Address",
    "Phone",
    "Payment Methods",
    "Total Amount",
    "Action",
  ];
  const [orders, setOrder] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);

  const handlePageClick = (event: any) => {
    const page = event.selected + 1;
    setPage(page);
  };
  const getOrders = async () => {
    try {
      setLoading(true);
      const response: TOrderResponse = await getAllOrder(page);
      console.log(response);
      setOrder(response.data.orders);
      setPageCount(Math.ceil(response.data.totalPage));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    void getOrders();
  }, [page]);
  console.log(orders);
  return (
    <DashboardLayout>
      <DashboardHeading
        title="Orders"
        desc="Manage all orders"
      ></DashboardHeading>
      <Table headings={headings} loading={loading} length={orders.length}>
        {orders?.map((item: IOrder, index: number) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td className=" text-sm max-w-[150px]">{item?.userId?.name}</td>
            <td className="text-sm max-w-[100px] overflow-hidden">
              {item?.shippingAddress}
            </td>
            <td className="text-sm">{item?.phoneNumber}</td>
            <td className="text-sm">
              {item?.paymentMethods === paymentMethods.CASHPAYMENT && (
                <span className="p-1 text-blue-500 bg-blue-200 rounded-md">
                  {item?.paymentMethods}
                </span>
              )}
              {item?.paymentMethods === paymentMethods.ONLINEPAYMENT && (
                <span className="p-1 text-red-500 bg-red-200 rounded-md">
                  {item?.paymentMethods}
                </span>
              )}
            </td>
            <td className="text-sm text-red-500">
              {formatPrice(item?.totalAmount)}đ
            </td>
            <td>
              <div className="flex items-center gap-x-3 text-primary">
                <IconEdit></IconEdit>
                <IconDelete></IconDelete>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <Paginate
        pageCount={pageCount}
        handlePageClick={handlePageClick}
      ></Paginate>
    </DashboardLayout>
  );
};

export default OrderManage;
