<template>
	<div class></div>
</template>

<script>
import { getAlbumDetail } from "@/api/api.js";
export default {
	data() {
		return {
			pics: []
		};
	},
	methods: {
		async getDetail() {
			const { params } = this.$route;
			const { data } = await getAlbumDetail({ params: params });
			if (data?.success_code == 200) {
        const pics = data?.data?.pics;
				if (this._getType(pics) == "array") {
					this.pics = [...pics];
				}
			}
		}
	},
	created() {
		this.getDetail();
	}
};
</script>

<style lang="less" scoped>
</style>