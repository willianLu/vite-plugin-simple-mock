<script setup lang="ts">
import * as Api from "../api";

defineProps<{ msg: string }>();

function handleRequest() {
  Api.queryTest({
    id: 1,
  }).then(([res]) => {
    console.log(res, "方法：queryTest");
  });
  Api.queryUserInfo({
    id: 2,
    name: "liu",
  }).then(([res]) => {
    console.log(res, "方法：queryUserInfo");
  });

  Api.queryFormData({
    id: 1,
    a: [2, "3"],
    b: {
      c: 4,
      d: "5",
    },
  }).then(([res]) => {
    console.log(res, "方法：queryFormData");
  });

  Api.ignoreTest();
  Api.disabledTest();
  Api.queryOapiTest({ id: "oapi" });
  Api.queryNapiTest({ id: "napi" });
  Api.queryTimout();
}
</script>

<template>
  <h1>{{ msg }}</h1>
  <button @click="handleRequest">请求测试</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
