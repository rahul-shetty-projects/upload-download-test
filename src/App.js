import './App.css';
import DataTable from "react-data-table-component";
import Papa from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function App() {
  const defaultData = [
    {
      "sno": 1,
      "fruit_name": "Mango",
      "color": "Yellow",
      "price": 299,
      "season": "Summer"
    },
    {
      "sno": 2,
      "fruit_name": "Apple",
      "color": "Red",
      "price": 345,
      "season": "Winter"
    },
    {
      "sno": 3,
      "fruit_name": "Papaya",
      "color": "Orange",
      "price": 187,
      "season": "Spring"
    },
    {
      "sno": 4,
      "fruit_name": "Banana",
      "color": "Yellow",
      "price": 69,
      "season": "All"
    },
    {
      "sno": 5,
      "fruit_name": "Kivi",
      "color": "Green",
      "price": 399,
      "season": "Winter"
    }, {
      "sno": 6,
      "fruit_name": "Orange",
      "color": "Orange",
      "price": 199,
      "season": "Summer"
    },
  ];
  const [data, setData] = useState(defaultData)
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);


  function downloadCSV() {
    const csv = Papa.unparse(data);
    var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, 'download.csv');
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }
    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'download.csv');
    tempLink.click();
  }

  const handleDownload = () => {
    if (data) {
      try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'download.xlsx');
      } catch (error) {
        toast.error('Error While Downloading Data: ' + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      }
    } else {
      toast.error('No Data Available to Download.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
    }
  };


  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setProgress(true);
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary', dense: true });

        // Assuming the first sheet is the one you want to read
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];


        // Parse the sheet into an array of objects
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: true, dense: true });
        if (parsedData.length > 0) {
          for (var i = 0; i < parsedData.length; i++) {
            var element = parsedData[i];
            var error = false;
            if (!hasOnlyKeys(element, ['sno', 'fruit_name', 'color', 'price', 'season'])) {
              error = true;
              break;
            }
          }
          if (!error) {
            setData(parsedData);
            setProgress(false);
            toast.success("Updated Excel Data Successfully.", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
          } else {
            setProgress(false);
            toast.error("Invalid Format Given", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            })
          }
        } else {
          toast.error("No rows found.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          })
          setProgress(false);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  function collectInput() {
    var input = document.getElementById("fileinput");
    input.click();
  }

  function hasOnlyKeys(obj, keys) {
    // Get the keys of the object
    const objKeys = Object.keys(obj);

    // Check if the length of object keys matches the length of keys array
    if (objKeys.length !== keys.length) {
      return false;
    }

    // Check if all keys in object are present in keys array
    for (let key of objKeys) {
      if (!keys.includes(key)) {
        return false;
      }
    }

    // If all keys match, return true
    return true;
  }

  function handleChange() {
    var input = document.getElementById("fileinput");
    console.log("ji")
    if (input.files[0]) {
      setProgress(true);
      var parse = Papa.parse(input.files[0], {
        skipEmptyLines: true,
        header: true,
        complete: function (results) {
          console.log("Finished:", results);
          var error = false;
          for (var i = 0; i < results.data.length; i++) {
            var element = results.data[i];
            if (!hasOnlyKeys(element, ['sno', 'fruit_name', 'color', 'price', 'season'])) {
              error = true;
              break;
            }
          }
          if (!error) {
            setData(results.data);
            setProgress(false);
            toast.success("Updated Excel Data Successfully.");
          } else {
            toast.error("Invalid Format Given")
          }
        }
      });
    }
  }

  const columns = [
    {
      name: 'S No',
      selector: row => row.sno,
      sortable: true
    },
    {
      name: 'Fruit Name',
      selector: row => row.fruit_name,
      sortable: true
    },
    {
      name: 'Color',
      selector: row => row.color,
      sortable: true
    },
    {
      name: 'Price',
      selector: row => row.price,
      sortable: true
    },
    {
      name: "Season",
      selector: row => row.season,
      sortable: true
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#0077ff',
        fontSize: 'large',
        fontWeight: 500,
        color: 'white',
      },
    },
    progress: {
      style: {
        height: "100px"
      },
    },
  };

  return (<>
    {loading ? (
      <div class="loader">
        <div class="justify-content-center jimu-primary-loading"></div>
      </div>
    ) : (
      <>
        <header style={{ backgroundColor: "#429aff63" }}>
          <div className="container">
            <div class="five">
              <h1>RAHUL SHETTY ACADEMY PRACTISE
                <span>Note: Data will be reset after page refresh.</span>
              </h1>
            </div>

          </div>
        </header>
        <div className="table-wrapper">
          <DataTable
            customStyles={customStyles}
            pagination
            paginationTotalRows={data.length}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            columns={columns}
            data={data}
            progressPending={progress}
            progressComponent={<div class="loader">
              <div class="justify-content-center jimu-primary-loading"></div>
            </div>}
          />
        </div>
        <div style={{ marginBottom: "40px" }} className='container'>
          <div className='buttons-box'>
            <button className='button' id="downloadButton" onClick={() => handleDownload()}>Download</button>
            <input onChange={(e) => handleFileUpload(e)} type="file" id="fileinput" accept='.xlsx,.xlx' class="upload" />
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /></>)}
  </>
  );
}

export default App;
