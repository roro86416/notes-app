<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter, RouterLink } from "vue-router";

const name = ref("");
const email = ref("");
const password = ref("");
const errMsg = ref("");
const auth = useAuth();
const router = useRouter();

const doRegister = async () => {
  errMsg.value = "";
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value, // 後端 Zod: 長度需 ≥ 8
    });
    router.push("/");
  } catch (e: any) {
    errMsg.value = e?.response?.data?.error || "註冊失敗";
  }
};
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="title">
        <span class="big-title">註冊 Normal Notes</span>
        <span class="describe"
          >已經有帳戶？<RouterLink to="/login">點此登入</RouterLink></span
        >
      </div>

      <form @submit.prevent="doRegister">
        <div class="login-card">
          <p>姓名</p>
          <input v-model="name" type="text" placeholder="請輸入姓名" required />

          <p>電子信箱地址</p>
          <input
            v-model="email"
            type="email"
            placeholder="請輸入電子信箱"
            required
          />

          <p>密碼</p>
          <input
            v-model="password"
            type="password"
            placeholder="請輸入密碼（至少 8 碼）"
            required
          />

          <p v-if="errMsg" style="color: #b91c1c">{{ errMsg }}</p>
          <button type="submit">建立帳戶</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  background-color: #ffffff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-style: normal;
  margin-top: 0;
}
.card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 32px;
  flex-shrink: 1;
  flex-grow: 2;
  padding: 40px;
  min-height: unset;
  max-width: 600px;
  border-radius: 20px;
  text-align: center;
}
.title {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 100px;
}
.big-title {
  font-size: 34px;
  font-weight: 700;
  line-height: 41px;
}
.describe {
  font-size: 17px;
  color: rgb(26, 26, 26);
}
.login-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  align-items: center;
}
.login-card p {
  text-align: left;
  width: 100%;
}
form {
  display: flex;
  flex-direction: column;
}
p {
  font-size: 17px;
  font-weight: 700;
  line-height: 21px;
  margin: 0;
  text-align: left;
}
input {
  background-color: transparent;
  color: rgb(23, 26, 32);
  height: 40px;
  margin: 0;
  font-size: 15px;
  font-weight: 300;
  width: 100%;
  border: 2px solid rgb(26, 26, 26);
  border-radius: 8px;
  padding-left: 12px;
}
button {
  transition-property: background-color, color, border-color;
  transition-duration: 0.25s;
  transition-timing-function: ease-out;
  color: #fff;
  background: rgb(26, 26, 26);
  height: 50px;
  min-width: 40px;
  padding: 10px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  flex-shrink: 1;
  place-content: center;
  gap: 8px;
  user-select: none;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
  border: 2px solid rgb(26, 26, 26);
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}
button:hover {
  background: #818181;
}
</style>
