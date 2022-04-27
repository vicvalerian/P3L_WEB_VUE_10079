<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Jadwal</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="jadwals" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                <v-icon dense color="red" @click="deleteHandler(item.id_jadwal_pegawai)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Jadwal</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-text-field v-model="form.id_jadwal_pegawai" label="ID Jadwal Pegawai" required></v-text-field>
                        <v-select v-model="form.shift_pegawai" :items="shift" label="Shift Pegawai" required></v-select>
                        <v-select v-model="form.hari_pegawai" :items="hari" label="Hari Pegawai" required></v-select>
                    </v-container>
                    <v-container v-else>
                        <v-select v-model="form.shift_pegawai" :items="shift" label="Shift Pegawai" required></v-select>
                        <v-select v-model="form.hari_pegawai" :items="hari" label="Hari Pegawai" required></v-select>
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
                <v-card-text>Anda Yakin ingin menghapus jadwal ini?</v-card-text>
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
                { text: "Id", align: "start", sortable: true, value: "id_jadwal_pegawai", },
                { text: "Shift", value: "shift_pegawai" },
                { text: "Hari", value: "hari_pegawai" },
                { text: "Action", value: "actions" },
            ],
            jadwal: new FormData(),
            jadwals: [],
            form: {
                id_jadwal_pegawai: '',
                shift_pegawai: '',
                hari_pegawai: '',
            },
            deleteId: '',
            editId: '',
            shift: [ '1', '2' ],
            hari: [ 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu' ],
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

        //Read Data Jadwal
        readData() {
            var url = this.$api + '/jadwal';
            this.$http.get(url).then((response) => {
                this.jadwals = response.data.data;
            });
        },

        //Insert Data Jadwal
        save(){
            this.jadwal.append('id_jadwal_pegawai', this.form.id_jadwal_pegawai);
            this.jadwal.append('shift_pegawai', this.form.shift_pegawai);
            this.jadwal.append('hari_pegawai', this.form.hari_pegawai);

            var url = this.$api + '/jadwal';
            this.load = true;
            this.$http.post(url, this.jadwal, {
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

        //Update Data Jadwal
        update(){
            var data = new FormData();
            data.append('shift_pegawai', this.form.shift_pegawai);
            data.append('hari_pegawai', this.form.hari_pegawai);

            var url = this.$api + '/jadwal/' + this.editId;
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

        //Delete Data Jadwal
        deleteData(){
            var url = this.$api + "/jadwal/" + this.deleteId;
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
            this.editId = item.id_jadwal_pegawai;
            this.form.shift_pegawai = item.shift_pegawai;
            this.form.hari_pegawai = item.hari_pegawai;
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
                id_jadwal_pegawai: null,
                shift_pegawai: null,
                hari_pegawai: null,
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