import React, { useEffect, useState } from "react";
import TableRow from "../TableRow/index";
import axios from "axios";
import "./DataTable.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function DataTable() {
  const [totalData, setTotalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [noOfPages, setNoOfPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [paginationPages, setPaginationPages] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [filteredData, setFilteredData] = useState([]);
  const [avgBalByTen, setAvgBalByTen] = useState([]);
  const [avgBal, setAvgBal] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filterSelected, setFilterSelected] = useState("");

  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = { totalValue: 0, count: 0, RelationShipTenure: 0 };
      }
      // Add object to list for given key's value
      acc[key].totalValue += parseInt(obj["AccountBalance"], 10);
      acc[key].RelationShipTenure += parseInt(obj["RelationShipTenure"], 10);
      acc[key].count += 1;
      return acc;
    }, {});
  }

  const calculateAvgBal = (data) => {
    const rawRegions = data.map((value) => {
      return value.Region;
    });
    const regions = new Set(rawRegions);
    setRegions(Array.from(regions));
    const groupedPeople = groupBy(data, "Region");
    const result = Object.keys(groupedPeople).map(function (k) {
      const item = groupedPeople[k];
      return item.totalValue / item.count;
    });
    setAvgBal(result);
    const avgBalTen = Object.keys(groupedPeople).map(function (k) {
      const item = groupedPeople[k];
      return item.totalValue / item.count / item.RelationShipTenure;
    });
    setAvgBalByTen(avgBalTen);
  };

  useEffect(() => {
    if (filteredData.length === 0) {
      axios.get("https://json-server-madan.herokuapp.com/contacts", {}).then((response) => {
        if (response.data.length > 0) {
          setTotalData(response.data);
          setTableData(response.data.slice(0, dataPerPage));
          setNoOfPages(Math.ceil(response.data.length / dataPerPage));
          calculateAvgBal(response.data);
        }
      });
    } else {
      setTableData(filteredData.slice(0, dataPerPage));
      setNoOfPages(Math.ceil(filteredData.length / dataPerPage));
      calculateAvgBal(filteredData);
    }
  }, [dataPerPage, filteredData]);

  useEffect(() => {
    if (noOfPages < 7) {
      let tArr = [];
      for (let i = 1; i <= noOfPages; i++) {
        tArr.push(i);
      }
      setPaginationPages(tArr);
    } else {
      if (activePage > 3 && activePage <= noOfPages - 3) {
        let tempArr = [];
        for (let i = activePage - 3; i <= activePage + 3; i++) {
          tempArr.push(i);
        }
        setPaginationPages([]);
        setPaginationPages(tempArr);
      } else {
        if (activePage <= 3) {
          setPaginationPages([1, 2, 3, 4, 5, 6, 7]);
        } else {
          let tArr = [];
          for (let i = noOfPages - 7; i <= noOfPages; i++) {
            tArr.push(i);
          }
          setPaginationPages(tArr);
        }
      }
    }
  }, [activePage, noOfPages]);

  const handlePageLimit = (e) => {
    setDataPerPage(e.target.value);
    changePage(1);
  };

  const changePage = (page) => {
    setActivePage(page);
    if (filteredData.length > 0) {
      if (page > 1) {
        setTableData(
          filteredData.slice(dataPerPage * (page - 1), dataPerPage * page)
        );
      } else {
        setTableData(filteredData.slice(0, dataPerPage));
      }
    } else {
      if (page > 1) {
        setTableData(
          totalData.slice(dataPerPage * (page - 1), dataPerPage * page)
        );
      } else {
        setTableData(totalData.slice(0, dataPerPage));
      }
    }
  };

  const searchData = (e, columnName) => {
    let filterValues = totalData.filter((data) => {
      return String(data[columnName])
        .toUpperCase()
        .includes(String(e.target.value).toUpperCase());
    });
    setFilteredData(filterValues);
    setTableData(filterValues.slice(0, dataPerPage));
    setNoOfPages(Math.ceil(filterValues.length / dataPerPage));
  };

  const handleFilterSelection = (e) => {
    setFilterSelected(e.target.value);
  };

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "My chart",
    },
    subtitle: {
      text: "Custom generated fake data not to be considered as real",
    },
    xAxis: {
      title: {
        text: "Regions",
      },
      categories: regions,
    },
    yAxis: [
      {
        title: {
          text: "Average Account Balance",
        },
        labels: {
          formatter: function () {
            return "Rs " + this.value;
          },
        },
      },
      {
        title: {
          text: "Average Account Balance/Average Tenure",
        },
        labels: {
          formatter: function () {
            return "Rs " + this.value;
          },
        },
      },
    ],
    series: [
      {
        name: "Average Account Balance/Average Tenure",
        data: avgBalByTen,
      },
      {
        name: "Average Account Balance",
        data: avgBal,
      },
    ],
  };

  return (
    <div>
      <div className="filters">
        <select onChange={(e) => handleFilterSelection(e)}>
          <option value="">Select Filter</option>
          <option value="State">State</option>
          <option value="Qualification">Qualification</option>
          <option value="TypeofAccount">Account Type</option>
        </select>
        <input
          type="text"
          placeholder="Please enter filter value"
          onChange={(e) => searchData(e, filterSelected)}
        />
      </div>
      <div className="table-wrapper">
        <table id="myTable">
          <thead>
            <tr>
              <th>CustomerID</th>
              <th>CustomerName</th>
              <th>Age</th>
              <th>Qualification</th>
              <th>Income</th>
              <th>WorkExp</th>
              <th>NumofHousehold</th>
              <th>Region</th>
              <th>State</th>
              <th>AccountBalance</th>
              <th>RelationShipTenure</th>
              <th>NumberofAccounts</th>
              <th>TypeofAccount</th>
              <th>EmploymentStatus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="Search by Customer ID"
                  onChange={(e) => searchData(e, "CustomerID")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Customer Name"
                  onChange={(e) => searchData(e, "CustomerName")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Age"
                  onChange={(e) => searchData(e, "Age")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Qualification"
                  onChange={(e) => searchData(e, "Qualification")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Income"
                  onChange={(e) => searchData(e, "Income")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Work Exp"
                  onChange={(e) => searchData(e, "WorkExp")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Num of Household"
                  onChange={(e) => searchData(e, "NumofHousehold")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Region"
                  onChange={(e) => searchData(e, "Region")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by State"
                  onChange={(e) => searchData(e, "State")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Account Balance"
                  onChange={(e) => searchData(e, "AccountBalance")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Relationship Tenure"
                  onChange={(e) => searchData(e, "RelationShipTenure")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Number of Accounts"
                  onChange={(e) => searchData(e, "NumberofAccounts")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Type of Account"
                  onChange={(e) => searchData(e, "TypeofAccount")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Search by Employment Status"
                  onChange={(e) => searchData(e, "EmploymentStatus")}
                />
              </td>
            </tr>
            {tableData.map((row, i) => (
              <TableRow key={`${row.CustomerName}+${i}`} data={row}></TableRow>
            ))}
          </tbody>
        </table>
      </div>
      <div className="page-limit-selector">
        <select onChange={(e) => handlePageLimit(e)}>
          <option value="10">Show 10</option>
          <option value="30">Show 30</option>
          <option value="50">Show 50</option>
          <option value="100">Show 100</option>
        </select>
      </div>
      <div className="pagination">
        <input type="button" onClick={() => changePage(1)} value="First" />
        {paginationPages.map((page, i) => {
          return (
            <span
              className={`page-number ${activePage === page ? "active" : ""}`}
              onClick={() => changePage(page)}
              key={i}
            >
              {page}
            </span>
          );
        })}
        <input
          type="button"
          onClick={() => changePage(noOfPages)}
          value="Last"
        />
      </div>
      <div className="charts">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export default DataTable;
