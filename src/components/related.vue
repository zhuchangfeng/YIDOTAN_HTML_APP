<template>
	<div class="related border1">
		<div class="related-image lazy" v-lazy:background-image="related.cover"></div>
		<div class="related-subject">{{related.subject}}</div>
		<div class="related-summary">{{related.summary}}</div>
	</div>
</template>

<script>
export default {
	props: {
		related: {
			type: Object,
			required: false
		}
	}
};
</script>

<style lang="less" scoped>
.n-ellipsis(@n) {
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: @n;
	-webkit-box-orient: vertical;
	text-overflow: ellipsis;
	word-break: break-all;
}
.related {
	padding: 18.75px 0 14.5833px 0;
	&.border1 {
		border-bottom: 1px solid #e6e6e6;
	}
	.related-image {
		height: 201.031px;
		background-color: #eee;
		border-radius: 3.12504px;
		background-position: 50%;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.related-subject {
		.n-ellipsis(2);
		font-size: 17.7083px;
		color: #333;
		font-weight: 500;
		margin: 8.33332px 0 4.16672px;
		line-height: 26.0416px;
	}
	.related-summary {
		.n-ellipsis(2);
		font-size: 14.5833px;
		line-height: 22.9167px;
		color: #666;
		font-weight: 400;
	}
}
</style>