<template>
  <main>
    <v-main>
      <h1 class="mt-n12 custom1--text">Profil</h1>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">

            <v-card v-if="loggedIn">
              <v-card-text class="pt-4">
                <div>
                  <v-form v-model="valid" ref="form">
                    <v-text-field v-model="id_pelanggan" readonly filled label="Id Pelanggan"></v-text-field>
                    <v-text-field v-model="nama_pelanggan" required filled label="Nama"></v-text-field>
                    <v-text-field v-model="email_pelanggan" required filled label="Email"></v-text-field>
                    <v-text-field v-model="notelp_pelanggan" required filled label="Nomor Telepon"></v-text-field>
                    <v-textarea v-model="alamat_pelanggan" required filled label="Alamat"></v-textarea>
                    <v-text-field v-model="tgl_lahir_pelanggan" required filled label="Tanggal Lahir" type="date"></v-text-field>
                    <v-select filled v-model="jenis_kelamin_pelanggan" :items="jeniskelamin" label="Jenis Kelamin" required></v-select>
                    <v-text-field v-model="no_ktp_pelanggan" required filled label="Nomor KTP"></v-text-field>
                    <v-text-field v-model="no_sim_pelanggan" filled label="Nomor SIM"></v-text-field>
                    <v-text-field v-model="password_pelanggan" filled label="Password" :type="show ? 'text' : 'password'" 
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show"></v-text-field>

                    <v-layout>
                      <v-layout justify-center>
                        <v-btn class="mr-2" @click="updatePelanggan" color="success"><strong>Edit Data</strong></v-btn>
                      </v-layout>
                    </v-layout>
                  </v-form>
                </div>
              </v-card-text>
            </v-card>

            <v-card v-if="loggedInPegawai">
              <v-card-text class="pt-4">
                <div>
                  <v-form v-model="valid" ref="form">
                    <v-container fluid>
                      <v-layout justify-center align-center>
                        <v-flex shrink>
                          <div><v-img width="250px" :src="previewImageUrl == '' ? $baseUrl+'/storage/'+foto_pegawai : previewImageUrl" id="previewImage" class="mb-5"></v-img></div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <v-text-field v-model="id_pegawai" readonly filled label="Id Pegawai"></v-text-field>
                    <v-text-field v-model="id_jabatan" readonly filled label="Jabatan"></v-text-field>
                    <v-text-field v-model="nama_pegawai" required filled label="Nama"></v-text-field>
                    <v-textarea v-model="alamat_pegawai" required filled label="Alamat"></v-textarea>
                    <v-text-field type="date" v-model="tgl_lahir_pegawai" required filled label="Tanggal Lahir"></v-text-field>
                    <v-select v-model="jenis_kelamin_pegawai" :items="jeniskelamin" required filled label="Jenis Kelamin" type="date"></v-select>
                    <v-text-field filled v-model="email_pegawai" label="Email" required></v-text-field>
                    <v-text-field v-model="notelp_pegawai" required filled label="Nomor Telepon"></v-text-field>
                    <v-text-field v-model="password_pegawai" required filled label="Password" :type="show ? 'text' : 'password'" 
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show"></v-text-field>

                    <v-layout>
                      <v-layout justify-center>
                        <v-btn class="mr-2" @click="updatePegawai" color="success"><strong>Edit Data</strong></v-btn>
                      </v-layout>
                    </v-layout>
                  </v-form>
                </div>
              </v-card-text>
            </v-card>

            <h1 v-if="loggedIn" class="mt-8 custom1--text">Kartu Pelanggan</h1>
            <v-card class="elevation-12" v-if="loggedIn">
              <v-window>
                <v-window-item>
                  <v-row class="fill-height fluid blue darken-4" align="center">
                    <v-col cols="12" md="4" class="blue darken-4">
                      <v-card-text class="white--text mt-n8">
                        <h1 class="text-center display-1 custom2--text"><strong>Atma Jogja Rental</strong></h1>
                      </v-card-text>
                      <img src="@/assets/car.png" height="200px" class="mb-8">                          
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12 mb-4">
                        <h1 class="text-right display-2 white--text text--accent-3 custom3--text mt-n6"><strong>{{ nama_pelanggan }}</strong></h1>
                        <h2 class="text-right display-1 white--text text--accent-3 custom3--text mt-8">Customer</h2>
                        <h2 class="text-right display-1 white--text text--accent-3 custom3--text mt-2">{{ id_pelanggan }}</h2>
                        <h2 class="text-right white--text text--accent-3 custom3--text mt-16">Mobile: {{ notelp_pelanggan }}</h2>
                        <h2 class="text-right white--text text--accent-3 custom3--text mt-4">Address: {{ alamat_pelanggan }}</h2>
                        <h2 class="text-right white--text text--accent-3 custom3--text mt-4">Email: {{ email_pelanggan }}</h2>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>

          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
  </main>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Orelega+One&family=Sansita:wght@700&family=Satisfy&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Sansita:wght@700&family=Satisfy&display=swap');

  .custom1--text{
    font-family: 'Orelega One', cursive;
    font-size: 52px;
  }

  .custom2--text{
      font-family: 'Anton', sans-serif !important;
      color: tomato;
  }

  .custom3--text{
      font-family: 'Sansita', sans-serif !important;
  }

  .bgSquare {
    height: 500px;
    width: 1000px;
    background-color: #245399;
    justify-content: center !important;
  }
</style>

<script>
export default {
  name: "Profil",
  data(){
    return{
      load: false,
      show: false,
      snackbar: false,
      error_message: '',
      color: '',
      jeniskelamin: [ 'Laki-Laki', 'Perempuan' ],
      id_pelanggan: '',
      nama_pelanggan: '',
      email_pelanggan: '',
      notelp_pelanggan: '',
      alamat_pelanggan: '',
      tgl_lahir_pelanggan: '',
      jenis_kelamin_pelanggan: '',
      no_ktp_pelanggan: '',
      no_sim_pelanggan: '',
      password_pelanggan: '',
      id_pegawai: '',
      id_jabatan: '',
      nama_pegawai: '',
      alamat_pegawai: '',
      tgl_lahir_pegawai: '',
      jenis_kelamin_pegawai: '',
      email_pegawai: '',
      notelp_pegawai: '',
      password_pegawai: '',
      foto_pegawai: '',
      previewImageUrl : ''
    }
  },
  methods: {
    onPreviewImage(e) {
      this.previewImageUrl = URL.createObjectURL(e)
    },

    updatePelanggan(){
      var data = new FormData();
      data.append('nama_pelanggan', this.nama_pelanggan);
      data.append('alamat_pelanggan', this.alamat_pelanggan);
      data.append('tgl_lahir_pelanggan', this.tgl_lahir_pelanggan);
      data.append('jenis_kelamin_pelanggan', this.jenis_kelamin_pelanggan);
      data.append('email_pelanggan', this.email_pelanggan);
      data.append('notelp_pelanggan', this.notelp_pelanggan);
      data.append('no_ktp_pelanggan', this.no_ktp_pelanggan);
      data.append('no_sim_pelanggan', this.no_sim_pelanggan ?? '');
      data.append('status_pelanggan', localStorage.getItem('status_pelanggan'));
      data.append('password_pelanggan', this.password_pelanggan ?? '');

      var url = this.$api + '/pelanggan/' + localStorage.getItem('id_pelanggan');
      this.load = true;
      this.$http.post(url, data, {
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
      })
      .then((response) => {
      this.error_message = response.data.message;
      this.color = 'green';
      this.snackbar = true;
      this.load = true;
      this.closePelanggan();
      location.reload();
      })
      .catch((error) => {
      this.error_message = error.response.data.message;
      this.color = "red";
      this.snackbar = true;
      this.load = false;
      });
    },

    updatePegawai(){
      var data = new FormData();
      data.append('id_jabatan', localStorage.getItem('id_pegawai'));
      data.append('nama_pegawai', this.nama_pegawai);
      data.append('alamat_pegawai', this.alamat_pegawai);
      data.append('tgl_lahir_pegawai', this.tgl_lahir_pegawai);
      data.append('jenis_kelamin_pegawai', this.jenis_kelamin_pegawai);
      data.append('email_pegawai', this.email_pegawai);
      data.append('notelp_pegawai', this.notelp_pegawai);

      // var inputFotoPegawai = document.getElementById('fotoPegawai'),
      // dataFotoPegawai = inputFotoPegawai.files[0];

      // if(dataFotoPegawai){
      //     data.append('foto_pegawai', dataFotoPegawai);
      // }

      data.append('password_pegawai', this.password_pegawai ?? '');

      var url = this.$api + '/pegawai/' + localStorage.getItem('id_pegawai');
      this.load = true;
      this.$http.post(url, data, {
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
      })
      .then((response) => {
      this.error_message = response.data.message;
      this.color = 'green';
      this.snackbar = true;
      this.load = true;
      this.closePegawai();
      location.reload();
      })
      .catch((error) => {
      this.error_message = error.response.data.message;
      this.color = "red";
      this.snackbar = true;
      this.load = false;
      });
    },

    readDataPelanggan(){
      this.id_pelanggan = localStorage.getItem('id_pelanggan');
      this.nama_pelanggan = localStorage.getItem('nama_pelanggan');
      this.email_pelanggan = localStorage.getItem('email');
      this.notelp_pelanggan = localStorage.getItem('notelp_pelanggan');
      this.alamat_pelanggan = localStorage.getItem('alamat_pelanggan');
      this.tgl_lahir_pelanggan = localStorage.getItem('tgl_lahir_pelanggan');
      this.jenis_kelamin_pelanggan = localStorage.getItem('jenis_kelamin_pelanggan');
      this.no_ktp_pelanggan = localStorage.getItem('no_ktp_pelanggan');
      this.no_sim_pelanggan = localStorage.getItem('no_sim_pelanggan');
      if(localStorage.getItem('no_sim_pelanggan') == 'null'){
        this.no_sim_pelanggan = '';
      } else{
        this.no_sim_pelanggan = localStorage.getItem('no_sim_pelanggan');
      }
    },

    setPelangganActive(){
      localStorage.setItem('id_pelanggan', this.id_pelanggan);
      localStorage.setItem('nama_pelanggan', this.nama_pelanggan);
      localStorage.setItem('email', this.email_pelanggan);
      localStorage.setItem('notelp_pelanggan', this.notelp_pelanggan);
      localStorage.setItem('alamat_pelanggan', this.alamat_pelanggan);
      localStorage.setItem('tgl_lahir_pelanggan', this.tgl_lahir_pelanggan);
      localStorage.setItem('jenis_kelamin_pelanggan', this.jenis_kelamin_pelanggan);
      localStorage.setItem('no_ktp_pelanggan', this.no_ktp_pelanggan);
      localStorage.setItem('no_sim_pelanggan', this.no_sim_pelanggan);
    },

    readDataPegawai(){
      this.id_pegawai = localStorage.getItem('id_pegawai');
      if(localStorage.getItem('id_pegawai') == '1'){
        this.id_jabatan = 'Manager';
      } else if(localStorage.getItem('id_pegawai') == '2'){
        this.id_jabatan = 'Admin';
      } else if(localStorage.getItem('id_pegawai') == '3'){
        this.id_jabatan = 'Customer Service';
      }
      this.nama_pegawai = localStorage.getItem('nama_pegawai');
      this.alamat_pegawai = localStorage.getItem('alamat_pegawai');
      this.tgl_lahir_pegawai = localStorage.getItem('tgl_lahir_pegawai');
      this.email_pegawai = localStorage.getItem('email');
      this.notelp_pegawai = localStorage.getItem('notelp_pegawai');
      this.jenis_kelamin_pegawai = localStorage.getItem('jenis_kelamin_pegawai');
      this.foto_pegawai = localStorage.getItem('foto_pegawai');
    },

    setPegawaiActive(){
      localStorage.setItem('id_pegawai', this.id_pegawai);
      localStorage.setItem('id_jabatan', this.id_jabatan);
      localStorage.setItem('nama_pegawai', this.nama_pegawai);
      localStorage.setItem('alamat_pegawai', this.alamat_pegawai);
      localStorage.setItem('tgl_lahir_pegawai', this.tgl_lahir_pegawai);
      localStorage.setItem('email', this.email_pegawai);
      localStorage.setItem('notelp_pegawai', this.notelp_pegawai);
      localStorage.setItem('jenis_kelamin_pegawai', this.jenis_kelamin_pegawai);
      localStorage.setItem('foto_pegawai', this.foto_pegawai);
    },

    closePelanggan(){
      this.setPelangganActive();
      this.readDataPelanggan();
    },

    closePegawai(){
      this.setPegawaiActive();
      this.readDataPegawai();
    },
  },
  computed: {
    //Login Pelanggan
    loggedIn(){
      return localStorage.getItem("email") != null && localStorage.getItem('id_jabatan') == null;
    },

    //Login Manager
    loggedInPegawai(){
      return localStorage.getItem('id_jabatan') != null && localStorage.getItem("email") != null;
    },
  },
  mounted(){
    this.readDataPelanggan();
    this.readDataPegawai();
  }
}
</script>