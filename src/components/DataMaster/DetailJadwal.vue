<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Detail Jadwal</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="detailJadwals" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                    <v-icon dense color="red" @click="deleteHandler(item.id_detail_jadwal)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Detail Jadwal</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="pegawais" v-model="form.id_pegawai" label="Pegawai" item-value="id_pegawai" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                        </v-select>
                        <v-select :items="jadwals" v-model="form.id_jadwal_pegawai" label="Jadwal" item-value="id_jadwal_pegawai" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_jadwal_pegawai }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_jadwal_pegawai }}
	                        </template>
                        </v-select>
                        <v-select v-model="form.keterangan_detail_jadwal" :items="keterangan" label="Keterangan Detail" required></v-select>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="pegawais" v-model="form.id_pegawai" label="Pegawai" item-value="id_pegawai" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_pegawai }} - {{ data.item.nama_pegawai }}
	                        </template>
                        </v-select>
                        <v-select :items="jadwals" v-model="form.id_jadwal_pegawai" label="Jadwal" item-value="id_jadwal_pegawai" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_jadwal_pegawai }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_jadwal_pegawai }}
	                        </template>
                        </v-select>
                        <v-select v-model="form.keterangan_detail_jadwal" :items="keterangan" label="Keterangan Detail" required></v-select>
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
                <v-card-text>Anda Yakin ingin menghapus detail jadwal ini?</v-card-text>
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
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                { text: "Id Detail Jadwal", align: "start", sortable: true, value: "id_detail_jadwal", },
                { text: "Pegawai", value: "nama_pegawai" },
                { text: "Jadwal", value: "id_jadwal_pegawai" },
                { text: "Keterangan", value: "keterangan_detail_jadwal" },
                { text: "Action", value: "actions" },
            ],
            detailJadwal: new FormData(),
            detailJadwals: [],
            pegawais: [],
            jadwals: [],
            form: {
                id_pegawai: '',
                id_jadwal_pegawai: '',
                keterangan_detail_jadwal: '',
            },
            deleteId: '',
            editId: '',
            keterangan: [ 'Jadwal Customer Service', 'Jadwal Admin' ],
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

        //Read Data Detail Jadwal
        readDataDetailJadwal() {
            var url = this.$api + '/detailJadwal';
            this.$http.get(url).then((response) => {
                this.detailJadwals = response.data.data;
            });
        },

        //Read Data Pegawai
        readDataPegawai() {
            var url = this.$api + '/detailJadwalPegawai';
            this.$http.get(url).then((response) => {
                this.pegawais = response.data.data;
            });
        },

        //Read Data Jadwal
        readDataJadwal() {
            var url = this.$api + '/jadwal';
            this.$http.get(url).then((response) => {
                this.jadwals = response.data.data;
            });
        },

        //Insert Data Detail Jadwal
        save(){
            this.detailJadwal.append('id_pegawai', this.form.id_pegawai);
            this.detailJadwal.append('id_jadwal_pegawai', this.form.id_jadwal_pegawai);
            this.detailJadwal.append('keterangan_detail_jadwal', this.form.keterangan_detail_jadwal);

            var url = this.$api + '/detailJadwal';
            this.load = true;
            this.$http.post(url, this.detailJadwal, {
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
            this.readDataDetailJadwal();
            this.readDataPegawai();
            this.readDataJadwal();
            this.resetForm();
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Update Data Detail Jadwal
        update(){
            var data = new FormData();
            data.append('id_pegawai', this.form.id_pegawai);
            data.append('id_jadwal_pegawai', this.form.id_jadwal_pegawai);
            data.append('keterangan_detail_jadwal', this.form.keterangan_detail_jadwal);

            var url = this.$api + '/detailJadwal/' + this.editId;
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
            this.readDataDetailJadwal();
            this.readDataPegawai();
            this.readDataJadwal();
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

        //Delete Data Detail Jadwal
        deleteData(){
            var url = this.$api + "/detailJadwal/" + this.deleteId;
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
            this.readDataDetailJadwal();
            this.readDataPegawai();
            this.readDataJadwal();
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
            this.editId = item.id_detail_jadwal;
            this.form.id_pegawai = item.id_pegawai;
            this.form.id_jadwal_pegawai = item.id_jadwal_pegawai;
            this.form.keterangan_detail_jadwal = item.keterangan_detail_jadwal;
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
            this.readDataDetailJadwal();
            this.readDataPegawai();
            this.readDataJadwal();
        },

        cancel(){
            this.resetForm();
            this.readDataDetailJadwal();
            this.readDataPegawai();
            this.readDataJadwal();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.form ={
                id_pegawai: null,
                id_jadwal_pegawai: null,
                keterangan_detail_jadwal: null,
            };
        },
    },
    computed:{
        formTitle() {
        return this.inputType;
        },
    },
    mounted(){
        this.readDataDetailJadwal();
        this.readDataPegawai();
        this.readDataJadwal();
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