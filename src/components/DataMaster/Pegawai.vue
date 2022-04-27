<template>
    <v-main class="list">
        <h1 class="mt-n12 custom1--text">Pegawai</h1>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="pegawais" :search="search">
                <template v-slot:[`item.foto`]="{ item }">
                    <v-img :src="$baseUrl+'/storage/'+item.foto_pegawai" height="50px" width="50px" style="object-fit:cover; border-radius:50%; padding: 25px 0;"/>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                <v-icon dense color="green" @click="editHandler(item)">mdi-pencil</v-icon>
                <v-icon dense color="red" @click="deleteHandler(item.id_pegawai)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                <span class="headline">{{ formTitle }} Pegawai</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="inputType == 'Tambah'">
                        <v-select :items="jabatans" v-model="form.id_jabatan" label="Id Jabatan" item-value="id_jabatan" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_jabatan }} - {{ data.item.nama_jabatan }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_jabatan }} - {{ data.item.nama_jabatan }}
	                        </template>
                        </v-select>
                        <v-text-field v-model="form.nama_pegawai" label="Nama Pegawai" required></v-text-field>
                        <v-text-field v-model="form.alamat_pegawai" label="Alamat Pegawai" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_lahir_pegawai" label="Tanggal Lahir Pegawai" required></v-text-field>
                        <v-select v-model="form.jenis_kelamin_pegawai" label="Jenis Kelamin Pegawai" :items="jeniskelamin" required></v-select>
                        <v-text-field v-model="form.email_pegawai" label="Email Pegawai" required></v-text-field>
                        <v-text-field v-model="form.notelp_pegawai" label="Nomor Telepon Pegawai" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Pegawai" id="fotoPegawai" ref="fileFotoPegawai"></v-file-input>
                    </v-container>
                    <v-container v-else>
                        <v-select :items="jabatans" v-model="form.id_jabatan" label="Id Jabatan" item-value="id_jabatan" required>
                            <template slot="selection" slot-scope="data">
		                        {{ data.item.id_jabatan }} - {{ data.item.nama_jabatan }}
	                        </template>
                            <template slot="item" slot-scope="data">
		                        {{ data.item.id_jabatan }} - {{ data.item.nama_jabatan }}
	                        </template>
                        </v-select>
                        <v-text-field v-model="form.nama_pegawai" label="Nama Pegawai" required></v-text-field>
                        <v-text-field v-model="form.alamat_pegawai" label="Alamat Pegawai" required></v-text-field>
                        <v-text-field type="date" v-model="form.tgl_lahir_pegawai" label="Tanggal Lahir Pegawai" required></v-text-field>
                        <v-select v-model="form.jenis_kelamin_pegawai" label="Jenis Kelamin Pegawai" :items="jeniskelamin" required></v-select>
                        <v-text-field v-model="form.email_pegawai" label="Email Pegawai" required></v-text-field>
                        <v-text-field v-model="form.notelp_pegawai" label="Nomor Telepon Pegawai" required></v-text-field>
                        <v-file-input append-icon="mdi-camera" accept="image/*" label="Foto Pegawai" id="fotoPegawai" ref="fileFotoPegawai"></v-file-input>
                        <v-text-field v-model="form.password_pegawai" label="Password Pegawai" :type="show ? 'text' : 'password'" 
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
                <v-card-text>Anda Yakin ingin menghapus pegawai ini?</v-card-text>
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
                { text: "ID Pegawai", align: "start", sortable: true, value: "id_pegawai", },
                { text: "Jabatan", value: "nama_jabatan" },
                { text: "Nama", value: "nama_pegawai" },
                { text: "Alamat", value: "alamat_pegawai" },
                { text: "Tanggal Lahir", value: "tgl_lahir_pegawai" },
                { text: "Jenis Kelamin", value: "jenis_kelamin_pegawai" },
                { text: "Email", value: "email_pegawai" },
                { text: "Nomor Telepon", value: "notelp_pegawai" },
                { text: "Foto", value: "foto" },
                { text: "Action", value: "actions" },
            ],
            pegawai: new FormData(),
            pegawais: [],
            jabatans: [],
            form: {
                id_jabatan: '',
                nama_pegawai: '',
                alamat_pegawai: '',
                tgl_lahir_pegawai: '',
                jenis_kelamin_pegawai: '',
                email_pegawai: '',
                notelp_pegawai: '',
                foto_pegawai: '',
                password_pegawai: '',
            },
            deleteId: '',
            editId: '',
            jeniskelamin: ['Laki-Laki', 'Perempuan' ],
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

        //Read Data Pegawai
        readDataPegawai() {
            var url = this.$api + '/pegawai';
            this.$http.get(url).then((response) => {
                this.pegawais = response.data.data;
            });
        },

        //Read Data Jabatan
        readDataJabatan() {
            var url = this.$api + '/jabatan';
            this.$http.get(url).then((response) => {
                this.jabatans = response.data.data;
            });
        },

        //Insert Data Pegawai
        save(){
            this.pegawai.append('id_jabatan', this.form.id_jabatan);
            this.pegawai.append('nama_pegawai', this.form.nama_pegawai);
            this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai);
            this.pegawai.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai);
            this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
            this.pegawai.append('email_pegawai', this.form.email_pegawai);
            this.pegawai.append('notelp_pegawai', this.form.notelp_pegawai);

            var foto_pegawai = document.getElementById('fotoPegawai'), dataFotoPegawai = foto_pegawai.files[0];
            this.pegawai.append('foto_pegawai', dataFotoPegawai);

            var url = this.$api + '/pegawai';
            this.load = true;
            this.$http.post(url, this.pegawai, {
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
            this.readDataPegawai();
            this.readDataJabatan();
            this.resetForm();
            location.reload();
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Update Data Pegawai
        update(){
            var data = new FormData();
            data.append('id_jabatan', this.form.id_jabatan);
            data.append('nama_pegawai', this.form.nama_pegawai);
            data.append('alamat_pegawai', this.form.alamat_pegawai);
            data.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai);
            data.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
            data.append('email_pegawai', this.form.email_pegawai);
            data.append('notelp_pegawai', this.form.notelp_pegawai);

            var inputFotoPegawai = document.getElementById('fotoPegawai'),
            dataFotoPegawai = inputFotoPegawai.files[0];

            if(dataFotoPegawai){
                data.append('foto_pegawai', dataFotoPegawai);
            }

            data.append('password_pegawai', this.form.password_pegawai ?? '');

            var url = this.$api + '/pegawai/' + this.editId;
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
            this.readDataPegawai();
            this.readDataJabatan();
            this.resetForm();
            location.reload();
            this.inputType = 'Tambah';
            })
            .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
            });
        },

        //Delete Data Pegawai
        deleteData(){
            var url = this.$api + "/pegawai/" + this.deleteId;
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
            this.readDataPegawai();
            this.readDataJabatan();
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
            this.editId = item.id_pegawai;
            this.form.id_jabatan = item.id_jabatan;
            this.form.nama_pegawai = item.nama_pegawai;
            this.form.alamat_pegawai = item.alamat_pegawai;
            this.form.tgl_lahir_pegawai = item.tgl_lahir_pegawai;
            this.form.jenis_kelamin_pegawai = item.jenis_kelamin_pegawai;
            this.form.email_pegawai = item.email_pegawai;
            this.form.notelp_pegawai = item.notelp_pegawai;
            this.form.foto_pegawai = item.foto_pegawai;
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
            this.readDataPegawai();
            this.readDataJabatan();
        },

        cancel(){
            this.resetForm();
            this.readDataPegawai();
            this.readDataJabatan();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },

        resetForm(){
            this.form ={
                id_jabatan: '',
                nama_pegawai: '',
                alamat_pegawai: '',
                tgl_lahir_pegawai: '',
                jenis_kelamin_pegawai: '',
                email_pegawai: '',
                notelp_pegawai: '',
                foto_pegawai: '',
                password_pegawai: '',
            };
            this.$refs.fileFotoPegawai.reset();
        },
    },
    computed:{
        formTitle() {
            return this.inputType;
        },
    },
    mounted(){
        this.readDataPegawai();
        this.readDataJabatan();
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