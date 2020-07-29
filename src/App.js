import React, { Component } from 'react';
import './App.css';
//Import npm react-filepond
import { FilePond, File, registerPlugin } from 'react-filepond';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';
// FilePond Register plugin
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import store from './config'

registerPlugin(FilePondImagePreview);
class App extends Component {
  constructor(props) {
    super(props);
    this.storageRef = store.storage().ref();
    this.databaseRef = store.database().ref();
    this.state = {
      files: [], // is used to store file upload information
      uploadValue: 0, // Used to view the process. Upload
      filesMetadata: [], // Used to receive metadata from Firebase.
      rows: [], // draw the DataTable
      message: ''
    }
  }
  handleInit() {
    // handle init file upload here
    console.log('now initialised', this.pond);
  }
  storageRef = store.storage().ref(`/filepond`);
  handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    // handle file upload here
    console.log(" handle file upload here");
    console.log(this.storageRef.child(file.name).fullPath);
    const fileUpload = file;
    const task = this.storageRef.child(file.name).put(fileUpload)
    task.on(`state_changed`, (snapshort) => {
      console.log(snapshort.bytesTransferred, snapshort.totalBytes)
      let percentage = (snapshort.bytesTransferred / snapshort.totalBytes) * 100;
      //Process
      this.setState({
        uploadValue: percentage
      })
    }, (error) => {
      //Error
      this.setState({
        message: `Upload error : ${error.message}`
      })
    }, () => {
      //Success
      this.setState({
        message: `Upload Success`,
        picture: task.snapshot.downloadURL //เผื่อนำไปใช้ต่อในการแสดงรูปที่ Upload ไป
      })
      //Get metadata
      this.storageRef.child(file.name).getMetadata().then((metadata) => {
        // Metadata now contains the metadata for 'filepond/${file.name}'
        this.storageRef.child(file.name).getDownloadURL().then(url => {
          console.log(url)
          let metadataFile = {
            name: metadata.name,
            size: metadata.size,
            contentType: metadata.contentType,
            fullPath: metadata.fullPath,
            downloadURL: url
          }
          //Process save metadata
          this.databaseRef.push({ metadataFile });
        })
        alert("Uploaded Successfully")
      }).catch(function (error) {
        this.setState({
          messag: `Upload error : ${error.message}`
        })
      });
    })
  }
  render() {
    const { rows, filesMetadata } = this.state;
    return (
      <div>

        <div className="container">
          <div className="Margin-25">
            <label for="exampleInputEmail1">หน้าปกทริป<span className="p-1" style={{ color: "red", fontSize: "12px" }}>(ขนาดไม่เกิน 800px)</span></label>
            <FilePond allowMultiple={true} maxFiles={3} ref={ref => this.pond = ref}
              server={{ process: this.handleProcessing.bind(this) }}
              oninit={() => this.handleInit()}>
              {this.state.files.map(file => (
                <File key={file} source={file} />
              ))}
            </FilePond>
          </div>
        </div>

      </div>
    );
  }
}
export default App;