import React, { useRef, Component, useState } from "react";
import S3 from "react-aws-s3";
import * as AWS from "aws-sdk";

function Upload() {
  const fileInput = useRef();

  const handleClick = (event) => {
    event.preventDefault();
    const config = {
      bucketName: process.env.REACT_APP_BUCKET_NAME,
      dirName: process.env.REACT_APP_DIR_NAME,
      region: process.env.REACT_APP_REGION,
      accessKeyId: process.env.REACT_APP_ACCESS_ID,
      secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
      s3Url:
        "https://" + process.env.REACT_APP_BUCKET_NAME + ".s3.amazonaws.com",
    };
    console.log(config);
    let file = fileInput.current.files[0];
    let fileName = fileInput.current.files[0].name;
    console.log(file);
    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(file, fileName).then((data) => {
      console.log(data);
      if (data.status === 204) {
        console.log("success");
        const s3Path = {
          bucket: data.bucket,
          key: data.key,
        };
        putToDDB(username, password, s3Path);
      } else {
        console.error("error");
      }
    });
  };

  function putToDDB(username, password, s3Path) {
    const ddbClient = new AWS.DynamoDB.DocumentClient({
      region: "ap-south-1",
      secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
      accessKeyId: process.env.REACT_APP_ACCESS_ID,
    });
    const putData = (tableName, data) => {
      let params = {
        TableName: tableName,
        Item: data,
      };

      ddbClient.put(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    };
    putData("UserDetails", {
      userName: username,
      password: password,
      s3Path: s3Path,
    });
  }

  //   const calculate = (event) => {
  //     const lambda = new AWS.Lambda({
  //       region: process.env.REACT_APP_REGION,
  //       secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
  //       accessKeyId: process.env.REACT_APP_ACCESS_ID,
  //     });
  //     const params = {
  //       FunctionName: "mytestfunction",
  //       InvocationType: "RequestResponse",
  //       Payload: JSON.stringify({
  //         a: a,
  //         b: b,
  //         op: op,
  //       }),
  //     };
  //     lambda.invoke(params, function (err, obj) {
  //       if (err) {
  //         console.error(err);
  //       } else {
  //         alert("Result is: " + obj.Payload);
  //       }
  //     });
  //   };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //   const [a, setA] = useState(0);
  //   const [b, setB] = useState(0);
  //   const [op, setOp] = useState("Add");

  return (
    <>
      <form className="upload" onSubmit={handleClick} />
      <label>
        User Name:
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          name="username"
          type="text"
        />
      </label>
      <br />
      <label>
        Password:
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          name="password"
          type="password"
        />
      </label>
      <br />
      <label>
        Upload File:
        <input type="file" ref={fileInput} />
      </label>
      <br />
      <button type="submit" onClick={handleClick}>
        Upload
      </button>
      <br />
      <br />
      <br />
      {/* <label>
        Enter value of a:
        <input
          value={a}
          onChange={(event) => setA(event.target.value)}
          name="a"
          type="number"
        />
      </label>
      <br />
      <label>
        Enter value of b:
        <input
          value={b}
          onChange={(event) => setB(event.target.value)}
          name="b"
          type="number"
        />
      </label>
      <br />
      <label>
        Operation:
        <select value={op} onChange={(event) => setOp(event.target.value)}>
          <option value="Add">Add</option>
          <option value="Subtract">Subtract</option>
          <option value="Multiply">Multiply</option>
        </select>
      </label>
      <br />
      <button type="submit" onClick={calculate}>
        Calculate
      </button> */}
    </>
  );
}
export default Upload;
