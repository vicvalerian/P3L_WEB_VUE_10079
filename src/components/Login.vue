<template>
    <main>
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="8" md="8">
                        <v-card class="elevation-12 mt-12">
                            <v-window>
                                <v-window-item>
                                    <v-row class="fill-height fluid blue darken-4" align="center">
                                        <v-col cols="12" md="8" class="white">
                                            <v-card-text class="mt-12">
                                                <h1 class="text-center display-2 blue--text text--accent-3 custom1--text">Login Atma Jogja Rental</h1>
                                                <h3 class="text-center mt-4 custom2--text"><strong>Login untuk melanjutkan</strong></h3>
                                                <v-form v-model="valid" ref="form">
                                                    <v-select v-model="akun" label="Akun" :items="pilihanAkun" color="blue" prepend-icon="mdi-account" required></v-select>
                                                    <v-text-field label="Email" v-model="email" required prepend-icon="mdi-email" color="blue"/>
                                                    <v-text-field v-model="password" label="Password" prepend-icon="mdi-lock" :type="show ? 'text' : 'password'" color="blue"
                                                        @click:append="show = !show" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"/>
                                                </v-form>
                                            </v-card-text>
                                            <div class="text-center mt-6 mb-12">
                                                <v-btn rounded color="blue darken-4" dark @click="submit"><b>LOGIN</b></v-btn>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" md="4" class="blue darken-4">
                                            <img src="@/assets/logoAJR.png" height="200px" class="mb-8">
                                            <v-card-text class="white--text mt-n8">
                                                <h1 class="text-center display-1"><strong>Selamat Datang!</strong></h1>
                                                <h5 class="text-center" ><strong>Belum punya akun? Yuk daftar dulu!</strong></h5>
                                            </v-card-text>
                                            <div class="text-center">
                                                <v-btn rounded outlined dark @click="changePage"><b>REGISTER</b></v-btn>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                            </v-window>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </main>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Sansita:wght@700&family=Satisfy&display=swap');

    .custom1--text{
        font-family: 'Anton', sans-serif !important;
    }

    .custom2--text{
        font-family: 'Sansita', sans-serif !important;
    }
</style>

<script>
export default {
    name: "Login",
    data() {
        return {
            load: false,
            snackbar: false,
            success: false,
            show: false,
            error_message: '',
            color: '',
            email: '',
            password: '',
            pilihanAkun: [ 'Pelanggan', 'Pegawai', 'Driver' ],
        };
    },
    methods:{
        submit() {
            if(this.$refs.form.validate()) {
                //cek validasi data yg terkirim
                this.load = true;
                this.$http.post(this.$api + '/login', {
                    akun: this.akun,
                    email: this.email,
                    password: this.password,
                })
                .then((response) => {
                    this.error_message = response.data.message;
                    if(this.akun === 'Pelanggan'){
                        localStorage.setItem('id_pelanggan', response.data.data.id_pelanggan);
                        localStorage.setItem('nama_pelanggan', response.data.data.nama_pelanggan);
                        localStorage.setItem('notelp_pelanggan', response.data.data.notelp_pelanggan);
                        localStorage.setItem('alamat_pelanggan', response.data.data.alamat_pelanggan);
                        localStorage.setItem('email', response.data.data.email_pelanggan);
                        localStorage.setItem('jenis_kelamin_pelanggan', response.data.data.jenis_kelamin_pelanggan);
                        localStorage.setItem('tgl_lahir_pelanggan', response.data.data.tgl_lahir_pelanggan);
                        localStorage.setItem('no_ktp_pelanggan', response.data.data.no_ktp_pelanggan);
                        localStorage.setItem('no_sim_pelanggan', response.data.data.no_sim_pelanggan);
                        localStorage.setItem('status_pelanggan', response.data.data.status_pelanggan);
                        localStorage.setItem('password_pelanggan', response.data.data.password_pelanggan);
                    } else if(this.akun === 'Pegawai' ){
                        localStorage.setItem('id_pegawai', response.data.data.id_pegawai);
                        localStorage.setItem('id_jabatan', response.data.data.id_jabatan);
                        localStorage.setItem('nama_pegawai', response.data.data.nama_pegawai);
                        localStorage.setItem('notelp_pegawai', response.data.data.notelp_pegawai);
                        localStorage.setItem('alamat_pegawai', response.data.data.alamat_pegawai);
                        localStorage.setItem('jenis_kelamin_pegawai', response.data.data.jenis_kelamin_pegawai);
                        localStorage.setItem('tgl_lahir_pegawai', response.data.data.tgl_lahir_pegawai);
                        localStorage.setItem('password_pegawai', response.data.data.password_pegawai);
                        localStorage.setItem('foto_pegawai', response.data.data.foto_pegawai);
                        localStorage.setItem('email', response.data.data.email_pegawai);
                    } else{
                        return false;
                    }
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.clear();
                    this.$router.push({
                        name: 'Profil',
                    });
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    localStorage.removeItem('token');
                    this.load = false;
                });
            }
        },

        clear() {
            this.$refs.form.reset();
        },

        changePage(){
            this.$router.push({
                name: 'Register',
            });
        },
    },
};
</script>