<template>
	<figure v-lazy-container="{ selector: 'img' }" v-html="html"></figure>
</template>

<script>
export default {
	name: 'HtmlDefault',
	props: {
		html: {
			type: String
		}
	}
}
</script>

<style lang="less" scoped>
</style>
