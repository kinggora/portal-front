<template>
  <div>
    <v-card>
      <v-table>
        <tbody>
          <tr v-for="(file, index) in files" :key="index">
            <td>{{ file.origName }} ({{ getByteSize(file.size) }})</td>
            <td class="text-right">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="plain"
                    icon="mdi-download"
                    size="medium"
                    v-bind="props"
                    @click="downloadFile(file.id)"
                  ></v-btn>
                </template>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  name: "FileList",
  props: ["files"],
  setup() {
    const axios = inject("axios");
    const downloadFile = id => {
      axios
        .get(`/files/download/${id}`, {
          headers: { responseType: "blob" },
        })
        .then(res => {
          const fileName =
            res.headers["content-disposition"].split("filename=")[1];
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", decodeURI(fileName));
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch(e => {
          console.log(e.data);
        });
    };

    const getByteSize = size => {
      const byteUnits = ["KB", "MB", "GB", "TB"];
      for (let i = 0; i < byteUnits.length; i++) {
        size = Math.floor(size / 1024);
        if (size < 1024) {
          return size.toFixed(1) + byteUnits[i];
        }
      }
    };

    return { downloadFile, getByteSize };
  },
};
</script>

<style scoped></style>
