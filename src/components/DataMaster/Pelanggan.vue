<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Pelanggan</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="pelanggans" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                    <v-icon dense color="red" @click="deleteHandler(item.id_pelanggan)">mdi-delete</v-icon>
                </template>
                <template v-slot:[`item.status_pelanggan`]="{ item }">
                    <v-chip v-if="item.status_pelanggan === 'Belum Verifikasi'" color="red" outlined>{{ item.status_pelanggan }}</v-chip>
                    <v-chip v-if="item.status_pelanggan === 'Sudah Verifikasi'" color="green" outlined>{{ item.status_pelanggan }}</v-chip>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Pelanggan</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.nama_pelanggan" label="Nama Pelanggan" required></v-text-field>
                        <v-text-field v-model="form.alamat_pelanggan" label="Alamat Pelanggan" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_lahir_pelanggan" label="Tanggal Lahir Pelanggan" required></v-text-field>
                        <v-select v-model="form.jenis_kelamin_pelanggan" label="Jenis Kelamin Pelanggan" :items="jeniskelamin" required></v-select>
                        <v-text-field v-model="form.email_pelanggan" label="Email Pelanggan" required></v-text-field>
                        <v-text-field v-model="form.notelp_pelanggan" label="Nomor Telepon Pelanggan" required></v-text-field>
                        <v-text-field v-model="form.no_ktp_pelanggan" label="No KTP Pelanggan" counter="16" required></v-text-field>
                        <v-text-field v-model="form.no_sim_pelanggan" label="No SIM Pelanggan" counter="13"></v-text-field>
                    </v-container>
                    <v-container v-else>
                        <v-text-field v-model="form.nama_pelanggan" label="Nama Pelanggan" required></v-text-field>
                        <v-text-field v-model="form.alamat_pelanggan" label="Alamat Pelanggan" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_lahir_pelanggan" label="Tanggal Lahir Pelanggan" required></v-text-field>
                        <v-select v-model="form.jenis_kelamin_pelanggan" label="Jenis Kelamin Pelanggan" :items="jeniskelamin" required></v-select>
                        <v-text-field v-model="form.email_pelanggan" label="Email Pelanggan" required></v-text-field>
                        <v-text-field v-model="form.notelp_pelanggan" label="Nomor Telepon Pelanggan" required></v-text-field>
                        <v-text-field v-model="form.no_ktp_pelanggan" label="No KTP Pelanggan" counter="16" required></v-text-field>
                        <v-text-field v-model="form.no_sim_pelanggan" label="No SIM Pelanggan" counter="13"></v-text-field>
                        <v-select v-model="form.status_pelanggan" label="Status Pelanggan" :items="status" required></v-select>
                        <v-text-field v-model="form.password_pelanggan" label="Password Pelanggan" :type="show ? 'text' : 'password'" 
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>Anda Yakin ingin menghapus pelanggan ini?</v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteData">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "List",
    data(){
        return{
            inputType: 'Tambah',
            load: false,
            show: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                { text: "Id Pelanggan", align: "start", sortable: true, value: "id_pelanggan", },
                { text: "Nama", value: "nama_pelanggan" },
                { text: "Alamat", value: "alamat_pelanggan" },
                { text: "Tanggal Lahir", value: "tgl_lahir_pelanggan" },
                { text: "Jenis Kelamin", value: "jenis_kelamin_pelanggan" },
                { text: "Email", value: "email_pelanggan" },
                { text: "Nomor Telepon", value: "notelp_pelanggan" },
                { text: "Nomor KTP", value: "no_ktp_pelanggan" },
                { text: "Nomor SIM", value: "no_sim_pelanggan" },
                { text: "Status", value: "status_pelanggan" },
                { text: "Action", value: "actions" },
            ],
            pelanggan: new FormData(),
            pelanggans: [],
            form: {
                nama_pelanggan: '',
                alamat_pelanggan: '',
                tgl_lahir_pelanggan: '',
                jenis_kelamin_pelanggan: '',
                email_pelanggan: '',
                notelp_pelanggan: '',
                no_ktp_pelanggan: '',
                no_sim_pelanggan: '',
                status_pelanggan: '',
                password_pelanggan: '',
            },
            deleteId: '',
            editId: '',
            jeniskelamin: [ 'Laki-Laki', 'Perempuan' ],
            status: [ 'Belum Verifikasi', 'Sudah Verifikasi' ],
        };
    },
    methods: {
        setForm(){
            if (this.inputType !== 'Tambah') {
                this.update();
            } else {
                this.save();
            }
        },

        //Read Data Pelanggan
        readData() {
            var url = this.$api + '/pelanggan';
            this.$http.get(url).then((response) => {
                this.pelanggans = response.data.data;
            });
        },

        //Insert Data Pelanggan
        save(){
            this.pelanggan.append('nama_pelanggan', this.form.nama_pelanggan);
            this.pelanggan.append('alamat_pelanggan', this.form.alamat_pelanggan);
            this.pelanggan.append('tgl_lahir_pelanggan', this.form.tgl_lahir_pelanggan);
            this.pelanggan.append('jenis_kelamin_pelanggan', this.form.jenis_kelamin_pelanggan);
            this.pelanggan.append('email_pelanggan', this.form.email_pelanggan);
            this.pelanggan.append('notelp_pelanggan', this.form.notelp_pelanggan);
            this.pelanggan.append('no_ktp_pelanggan', this.form.no_ktp_pelanggan);
            this.pelanggan.append('no_sim_pelanggan', this.form.no_sim_pelanggan);

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
            this.close();
            this.readData();
            this.resetForm();
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Update Data Pelanggan
        update(){
            var data = new FormData();
            data.append('nama_pelanggan', this.form.nama_pelanggan);
            data.append('alamat_pelanggan', this.form.alamat_pelanggan);
            data.append('tgl_lahir_pelanggan', this.form.tgl_lahir_pelanggan);
            data.append('jenis_kelamin_pelanggan', this.form.jenis_kelamin_pelanggan);
            data.append('email_pelanggan', this.form.email_pelanggan);
            data.append('notelp_pelanggan', this.form.notelp_pelanggan);
            data.append('no_ktp_pelanggan', this.form.no_ktp_pelanggan);
            data.append('no_sim_pelanggan', this.form.no_sim_pelanggan ?? '');
            data.append('status_pelanggan', this.form.status_pelanggan);
            data.append('password_pelanggan', this.form.password_pelanggan ?? '');

            var url = this.$api + '/pelanggan/' + this.editId;
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
            this.close();
            this.readData();
            this.resetForm();
            this.inputType = 'Tambah';
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Delete Data Pelanggan
        deleteData(){
            var url = this.$api + "/pelanggan/" + this.deleteId;
            this.load = true;
            this.$http.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = true;
            this.close();
            this.readData();
            this.resetForm();
            this.inputType = "Tambah";
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_pelanggan;
            this.form.nama_pelanggan = item.nama_pelanggan;
            this.form.alamat_pelanggan = item.alamat_pelanggan;
            this.form.tgl_lahir_pelanggan = item.tgl_lahir_pelanggan;
            this.form.jenis_kelamin_pelanggan = item.jenis_kelamin_pelanggan;
            this.form.email_pelanggan = item.email_pelanggan;
            this.form.notelp_pelanggan = item.notelp_pelanggan;
            this.form.no_ktp_pelanggan = item.no_ktp_pelanggan;
            this.form.no_sim_pelanggan = item.no_sim_pelanggan;
            this.form.status_pelanggan = item.status_pelanggan;
            this.dialog = true;
            },

        deleteHandler(id){
            this.deleteId = id;
            this.dialogConfirm = true;
        },

        close(){
            this.dialog = false;
            this.inputType = 'Tambah';
            this.dialogConfirm = false;
            this.readData();
        },

        cancel(){
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.form ={
                nama_pelanggan: '',
                alamat_pelanggan: '',
                tgl_lahir_pelanggan: '',
                jenis_kelamin_pelanggan: '',
                email_pelanggan: '',
                notelp_pelanggan: '',
                no_ktp_pelanggan: '',
                no_sim_pelanggan: '',
                status_pelanggan: '',
                password_pelanggan: '',
            };
        },
    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
    mounted(){
        this.readData();
    },
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Orelega+One&family=Sansita:wght@700&family=Satisfy&display=swap');

  .custom1--text{
        font-family: 'Orelega One', cursive;
        font-size: 52px;
    }
</style>