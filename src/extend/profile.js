import Vue from 'vue';
import { mixinTest } from '../mixins/mixinTest';
import Home1 from '../components/Home/Home1.vue';
const Profile = Vue.extend({
    template: `
    <div class="profile">
        <p>{{extendData}}</br>实例传入的数据为:{{propsExtend}}</p>
        <button @click="mixinhh">8885</button>
        <Home1></Home1>
    </div>
    `,
    data() {
        return {
            extendData: '这是extend扩展的数据',
        }
    },
    components: { Home1 },
    mixins: [mixinTest],
    props: ['propsExtend']
})
export default Profile