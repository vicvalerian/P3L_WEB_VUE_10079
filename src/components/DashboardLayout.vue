<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight" width="225" app>
      <v-list-item class="blue darken-1">
        <v-list-item-content class="mt-n4 mb-n4 ml-n4">
          <v-col cols="">
            <img src="@/assets/logoAJR.png" height="75px">
          </v-col>
          <v-col>
            <h3 class="white--text custom2--text ml-n6">ATMA JOGJA RENTAL</h3>
          </v-col>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav v-if="loggedIn && !loggedInManager && !loggedInManager && !loggedInCS">
        <v-list-item v-for="item in customers" :key="item.title" link tag="router-link" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dense nav v-if="loggedInManager">
        <v-list-item v-for="item in managers" :key="item.title" link tag="router-link" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dense nav v-if="loggedInAdmin">
        <v-list-item v-for="item in admins" :key="item.title" link tag="router-link" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-left">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dense nav v-if="loggedInCS">
        <v-list-item v-for="item in cs" :key="item.title" link tag="router-link" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
    </v-navigation-drawer>
    <v-app-bar app fixed height="95px">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="black"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="loggedIn && !loggedInManager && !loggedInManager && !loggedInCS"><b>Selamat datang, anda masuk sebagai Pelanggan</b></v-toolbar-title>
      <v-toolbar-title v-if="loggedInManager"><b>Selamat datang, anda masuk sebagai Manager</b></v-toolbar-title>
      <v-toolbar-title v-if="loggedInAdmin"><b>Selamat datang, anda masuk sebagai Admin</b></v-toolbar-title>
      <v-toolbar-title v-if="loggedInCS"><b>Selamat datang, anda masuk sebagai Customer Service</b></v-toolbar-title>
      <VSpacer />
      <v-toolbar-items>
        <v-btn @click="logout()" text router><v-icon color="red">mdi-power</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Dashboard",
    data() {
      return {
        drawer: true,
        customers: [
          { title: "Profil", to: '/profil', icon: 'mdi-account' },
          { title: 'Daftar Promo', to: '/promoPelanggan', icon: 'mdi-sale' },
          { title: 'Brosur Mobil', to: '/mobilPelanggan', icon: 'mdi-car' },
          { title: 'Brosur Driver', to: '/driverPelanggan', icon: 'mdi-steering' },
          { title: 'Transaksi', to: '/transaksiPelanggan', icon: 'mdi-folder' },
          { title: 'Detail Transaksi', to: '/detailTransaksiPelanggan', icon: 'mdi-folder-multiple' },
        ],
        managers: [
          { title: "Profil", to: '/profil', icon: 'mdi-account' },
          { title: "Jabatan", to: '/jabatan', icon: 'mdi-account-tie' },
          { title: 'Promo', to: '/promo', icon: 'mdi-sale' },
          { title: 'Jadwal', to: '/jadwal', icon: 'mdi-clock-outline' },
          { title: 'Detail Jadwal', to: '/detailJadwal', icon: 'mdi-book-clock' },
        ],
        admins: [
          { title: "Profil", to: '/profil', icon: 'mdi-account' },
          { title: 'Pemilik', to: '/pemilik', icon: 'mdi-account-supervisor' },
          { title: 'Driver', to: '/driver', icon: 'mdi-steering' },
          { title: 'Riwayat Driver', to: '/driverRiwayatTransaksi', icon: 'mdi-history' },
          { title: 'Mobil', to: '/mobil', icon: 'mdi-car' },
          { title: 'Kontrak Mobil', to: '/kontrakMobil', icon: 'mdi-car-info' },
          { title: 'Pegawai', to: '/pegawai', icon: 'mdi-face-agent' },
        ],
        cs: [
          { title: "Profil", to: '/profil', icon: 'mdi-account' },
          { title: 'Pelanggan', to: '/pelanggan', icon: 'mdi-account-group' },
          { title: 'Transaksi', to: '/transaksi', icon: 'mdi-folder' },
          { title: 'Detail Transaksi', to: '/detailTransaksi', icon: 'mdi-folder-multiple' },
        ]
      };
    },
    methods: {
      logout(){
        if(localStorage.getItem('id_pelanggan') != null){
          localStorage.removeItem('id_pelanggan');
          localStorage.removeItem('nama_pelanggan');
          localStorage.removeItem('notelp_pelanggan');
          localStorage.removeItem('alamat_pelanggan');
          localStorage.removeItem('tgl_lahir_pelanggan');
          localStorage.removeItem('jenis_kelamin_pelanggan');
          localStorage.removeItem('no_ktp_pelanggan');
          localStorage.removeItem('no_sim_pelanggan');
          localStorage.removeItem('password_pelanggan');
          localStorage.removeItem('status_pelanggan');
          localStorage.removeItem('email');
          this.$router.push({
            name: 'Login',
          });
        } else if(localStorage.getItem('id_pegawai') != null){
          localStorage.removeItem('id_pegawai');
          localStorage.removeItem('id_jabatan');
          localStorage.removeItem('nama_pegawai');
          localStorage.removeItem('alamat_pegawai');
          localStorage.removeItem('tgl_lahir_pegawai');
          localStorage.removeItem('jenis_kelamin_pegawai');
          localStorage.removeItem('email');
          localStorage.removeItem('notelp_pegawai');
          localStorage.removeItem('password_pegawai');
          localStorage.removeItem('foto_pegawai');
          this.$router.push({
            name: 'Login',
          });
        }
      },
    },
    computed: {
      //Login Pelanggan
      loggedIn(){
        return localStorage.getItem("email") != null && localStorage.getItem('id_jabatan') == null;
      },

      //Login Manager
      loggedInManager(){
        return localStorage.getItem('id_jabatan') == '1' && localStorage.getItem("email") != null;
      },

      //Login Admin
      loggedInAdmin(){
        return localStorage.getItem('id_jabatan') == '2' && localStorage.getItem("email") != null;
      },

      //Login CS
      loggedInCS(){
        return localStorage.getItem('id_jabatan') == '3' && localStorage.getItem("email") != null;
      },
    }
  };
</script>

<style scoped>
  .fullheight {
    min-height: 100vh !important;
  }

  .router {
    text-decoration: none;
    color: black;
  }

  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Sansita:wght@700&family=Satisfy&display=swap');

  .custom1--text{
      font-family: 'Anton', sans-serif !important;
  }

  .custom2--text{
      font-family: 'Sansita', sans-serif !important;
  }
</style>