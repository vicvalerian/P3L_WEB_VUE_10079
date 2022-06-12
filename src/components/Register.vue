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
                                        <v-col cols="12" md="4">
                                            <img alt="Logo AJR" src="../assets/logoAJR.png" height="250">
                                            <v-card-text class="white--text mt-n4">
                                                <h1 class="text-center display-1"><strong>Kuy Daftar!</strong></h1>
                                                <h5 class="text-center"><strong>Sudah punya akun? Login disini!</strong></h5>
                                            </v-card-text>
                                            <div class="text-center">
                                                <v-btn rounded outlined dark @click="changePage"><b>Login</b></v-btn>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" md="8" class="white">
                                            <v-card-text class="mt-12">
                                                <h1 class="text-center display-2 blue--text text--accent-3 custom1--text">Buat Akun Pelanggan</h1>
                                                <h4 class="text-center mt-4 custom2--text">Daftarkan diri anda sekarang!</h4>
                                                <v-form v-model="valid" ref="form">
                                                    <v-text-field v-model="form.nama_pelanggan" label="Nama Lengkap" prepend-icon="mdi-account" required></v-text-field>
                                                    <v-text-field v-model="form.alamat_pelanggan" label="Alamat" prepend-icon="mdi-home" required></v-text-field>
                                                    <v-text-field type="date" v-model="form.tgl_lahir_pelanggan" label="Tanggal Lahir" prepend-icon="mdi-calendar-blank-outline" required></v-text-field>
                                                    <v-select v-model="form.jenis_kelamin_pelanggan" label="Jenis Kelamin" :items="jeniskelamin" prepend-icon="mdi-gender-male-female" required></v-select>
                                                    <v-text-field v-model="form.email_pelanggan" label="Email" prepend-icon="mdi-email" required></v-text-field>
                                                    <v-text-field v-model="form.notelp_pelanggan" label="Nomor Telepon" prepend-icon="mdi-phone" counter="13" required></v-text-field>
                                                    <v-text-field v-model="form.no_ktp_pelanggan" label="Nomor KTP" prepend-icon="mdi-card-account-details" counter="16" required></v-text-field>
                                                    <v-text-field v-model="form.no_sim_pelanggan" label="Nomor SIM" prepend-icon="mdi-card-account-details-outline" counter="13" required></v-text-field>
                                                    <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto KTP Pelanggan" id="ktpPelanggan" ref="fileKtpPelanggan"></v-file-input>
                                                    <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto SIM Pelanggan" id="simPelanggan" ref="fileSimPelanggan"></v-file-input>
                                                </v-form>
                                            </v-card-text>
                                            <div class="text-center mt-6 mb-12">
                                                <v-btn rounded color="blue darken-4" dark @click="submit"><b>REGISTER</b></v-btn>
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
    name: "Register",
    data() {
        return {
            load: false,
            snackbar: false,
            show: false,
            error_message: "",
            color: "",
            pelanggan: new FormData(),
            form: {
                nama_pelanggan: '',
                alamat_pelanggan: '',
                tgl_lahir_pelanggan: '',
                jenis_kelamin_pelanggan: '',
                email_pelanggan: '',
                notelp_pelanggan: '',
                no_ktp_pelanggan: '',
                no_sim_pelanggan: '',
                password_pelanggan: '',
            },
            jeniskelamin: [ 'Laki-Laki', 'Perempuan' ],
        };
    },
    methods: {
        submit() {
            this.pelanggan.append('nama_pelanggan', this.form.nama_pelanggan);
            this.pelanggan.append('alamat_pelanggan', this.form.alamat_pelanggan);
            this.pelanggan.append('tgl_lahir_pelanggan', this.form.tgl_lahir_pelanggan);
            this.pelanggan.append('jenis_kelamin_pelanggan', this.form.jenis_kelamin_pelanggan);
            this.pelanggan.append('email_pelanggan', this.form.email_pelanggan);
            this.pelanggan.append('notelp_pelanggan', this.form.notelp_pelanggan);
            this.pelanggan.append('no_ktp_pelanggan', this.form.no_ktp_pelanggan);
            this.pelanggan.append('no_sim_pelanggan', this.form.no_sim_pelanggan ?? '');

            var foto_ktp_pelanggan = document.getElementById('ktpPelanggan'), dataFotoKtpPelanggan = foto_ktp_pelanggan.files[0];
            this.pelanggan.append('foto_ktp_pelanggan', dataFotoKtpPelanggan);

            var foto_sim_pelanggan = document.getElementById('simPelanggan'),dataFotoSimPelanggan = foto_sim_pelanggan.files[0];
            if(dataFotoSimPelanggan){
                this.pelanggan.append('foto_sim_pelanggan', dataFotoSimPelanggan);
            }

            var url = this.$api + '/pelanggan';
            this.load = true;
            this.$http.post(url, this.pelanggan, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.changePage();
            })
            .catch((error) => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        changePage(){
            this.$router.push({
                name: 'Login',
            });
        },
    },
};
</script>