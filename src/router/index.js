import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path){
    return () => import(`../components/${path}.vue`);
}

const router = new VueRouter({
  mode: 'history',
  routes: [
        //Index
        {
            path: '/',
            name: 'Index',
            meta: { title: 'Index' },
            component: importComponent('Index'),
        },
        {
          path: '',
          component: importComponent('DashboardLayout'),
          children: [
              //Profil
              {
                  path: '/profil',
                  name: 'Profil',
                  meta: { title: 'Profil' },
                  component: importComponent('DataMaster/Profil'),
              },
              //Jabatan
              {
                  path: '/jabatan',
                  name: 'Jabatan',
                  meta: { title: 'Jabatan' },
                  component: importComponent('DataMaster/Jabatan'),
              },
              //Promo
              {
                  path: '/promo',
                  name: 'Promo',
                  meta: { title: 'Promo' },
                  component: importComponent('DataMaster/Promo'),
              },
              //Pemilik
              {
                  path: '/pemilik',
                  name: 'Pemilik',
                  meta: { title: 'Pemilik' },
                  component: importComponent('DataMaster/Pemilik'),
              },
              //Driver
              {
                  path: '/driver',
                  name: 'Driver',
                  meta: { title: 'Driver' },
                  component: importComponent('DataMaster/Driver'),
              },
              //Pelanggan
              {
                  path: '/pelanggan',
                  name: 'Pelanggan',
                  meta: { title: 'Pelanggan' },
                  component: importComponent('DataMaster/Pelanggan'),
              },
              //Jadwal
              {
                  path: '/jadwal',
                  name: 'Jadwal',
                  meta: { title: 'Jadwal' },
                  component: importComponent('DataMaster/Jadwal'),
              },
              //Mobil
              {
                  path: '/mobil',
                  name: 'Mobil',
                  meta: { title: 'Mobil' },
                  component: importComponent('DataMaster/Mobil'),
              },
              //Pegawai
              {
                  path: '/pegawai',
                  name: 'Pegawai',
                  meta: { title: 'Pegawai' },
                  component: importComponent('DataMaster/Pegawai'),
              },
              //Detail Jadwal
              {
                  path: '/detailJadwal',
                  name: 'DetailJadwal',
                  meta: { title: 'DetailJadwal' },
                  component: importComponent('DataMaster/DetailJadwal'),
              },
              //Transaksi
              {
                  path: '/transaksi',
                  name: 'Transaksi',
                  meta: { title: 'Transaksi' },
                  component: importComponent('DataMaster/Transaksi'),
              },
              //Detail Transaksi
              {
                  path: '/detailTransaksi',
                  name: 'DetailTransaksi',
                  meta: { title: 'DetailTransaksi' },
                  component: importComponent('DataMaster/DetailTransaksi'),
              },
          ],
      },
      //Login
      {
        path: '/login',
        name: 'Login',
        meta: { title: 'Login' },
        component: importComponent('Login'),
      },
      //Register
      {
        path: '/register',
        name: 'Register',
        meta: { title: 'Register' },
        component: importComponent('Register'),
      },
      {
          path: '*',
          redirect: '/'
      },
  ],
});

router.beforeEach((to, from, next) => {
    //Jika sudah Login maka tidak dapat kembali ke halaman Login & Register
    if(to.name == "Login"  && localStorage.getItem("email") != null ||
        to.name == "Register" && localStorage.getItem("email") != null){
        next({ name: "Profil" })
        document.to.meta.title = "Profil"
    }
    
    //Jika belum Login maka tidak dapat membuka halaman lain
    if(to.name == "Profil" && localStorage.getItem("email") == null ||
        to.name == "Jabatan" && localStorage.getItem("email") == null ||
        to.name == "Promo" && localStorage.getItem("email") == null ||
        to.name == "Pemilik" && localStorage.getItem("email") == null ||
        to.name == "Driver" && localStorage.getItem("email") == null ||
        to.name == "Pelanggan" && localStorage.getItem("email") == null ||
        to.name == "Jadwal" && localStorage.getItem("email") == null ||
        to.name == "Mobil" && localStorage.getItem("email") == null ||
        to.name == "Pegawai" && localStorage.getItem("email") == null ||
        to.name == "DetailJadwal" && localStorage.getItem("email") == null ||
        to.name == "Transaksi" && localStorage.getItem("email") == null ||
        to.name == "DetailTransaksi" && localStorage.getItem("email") == null){
        next({ name: "Login" })
        document.to.meta.title = "Login"
    }

    //Hanya Manager yang bisa melihat halaman jabatan, promo, jadwal, detail jadwal
    if(to.name == "Jabatan" && localStorage.getItem("id_jabatan") != "1" && localStorage.getItem("email") != null ||
        to.name == "Promo" && localStorage.getItem("id_jabatan") != "1" && localStorage.getItem("email") != null ||
        to.name == "Jadwal" && localStorage.getItem("id_jabatan") != "1" && localStorage.getItem("email") != null ||
        to.name == "DetailJadwal" && localStorage.getItem("id_jabatan") != "1" && localStorage.getItem("email") != null){
        next({ name: "Login" })
        document.to.meta.title = "Login"
    }

    //Hanya Admin yang bisa melihat halaman pemilik, driver, pegawai, mobil
    if(to.name == "Pemilik" && localStorage.getItem("id_jabatan") != "2" && localStorage.getItem("email") != null ||
        to.name == "Driver" && localStorage.getItem("id_jabatan") != "2" && localStorage.getItem("email") != null ||
        to.name == "Pegawai" && localStorage.getItem("id_jabatan") != "2" && localStorage.getItem("email") != null ||
        to.name == "Mobil" && localStorage.getItem("id_jabatan") != "2" && localStorage.getItem("email") != null){
        next({ name: "Login" })
        document.to.meta.title = "Login"
    }

    //Hanya CS yang bisa melihat halaman pelanggan, transaksi, detail transaksi
    if(to.name == "Pelanggan" && localStorage.getItem("id_jabatan") != "3" && localStorage.getItem("email") != null ||
        to.name == "Transaksi" && localStorage.getItem("id_jabatan") != "3" && localStorage.getItem("email") != null ||
        to.name == "DetailTransaksi" && localStorage.getItem("id_jabatan") != "3" && localStorage.getItem("email") != null){
        next({ name: "Login" })
        document.to.meta.title = "Login"
    }

    document.title = to.meta.title;
    next();
});

export default router;