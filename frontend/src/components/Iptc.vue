<template>
    <div class="hello">
      <h1>{{ msg }}</h1>
      <table width="80%">
        <tr v-for="image in allImageData" :key="image.name">
          <td width="50%"><img :src="backendUrl + backendImageUrl + image.name" width="95%" /></td>
          <td width="50%"><b>Description:</b><br/><textarea @blur="saveImageCaptionIptc" :data-name="image.name" v-model="image.iptc_description" rows="5" width="95%"></textarea></td>
        </tr>
      </table>
    </div>
  </template>
  
  <script>

  export default {
    name: 'Iptc-images-manipulator',
    props: {
      msg: String,
      allImageDataProp: Array
    },
    data: function () {
        return {
            // some variables
            allImageData: this.allImageDataProp,
            /*backendUrl: process.env.BACKEND_URL, 
            backendImageUrl: process.env.BACKEND_IMAGE_URL */
            backendUrl: "http://localhost:8082/",
            backendImageUrl: "images/",
        }
    },
    methods: {
        getAllImageData: function () {
          fetch('http://localhost:8082/api/allImagesList')
            .then(response => response.json())
            .then(data => (this.allImageData = data.files ));
        },
        saveImageCaptionIptc: function(e){
          let caption = e.target.value;
          let imageName = e.target.getAttribute("data-name");
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: imageName, iptc_description : caption})
          };

          fetch("http://localhost:8082/api/addIptcCaption", requestOptions)
            .then(console.log('ok'));
        }
    },
    mounted: function() {
      this.getAllImageData();
      //console.log(this.allImageData);
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  textarea{
    resize: none;
  }
  </style>
  