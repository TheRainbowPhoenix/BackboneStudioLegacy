<script lang="ts">
    export let name: String = "Title";
    export let scrollable: Boolean = true;

    export let height: string = "auto";
</script>

<div class="tab-title">
    <div class="flexr">
        <span class="tab-name">{name}</span>
        <span class="pull-right"></span>
        <slot name="tab-actions"></slot>
    </div>
    <slot name="header"></slot>
</div>

<div
        class="tab-container thin{scrollable===true ? ' scroller custom-scrollbar' : ''}"
        style="height: {height};">
    <div class="tab-content">
        <slot name="body"></slot>
    </div>
</div>

<style>
    .scroller {
        overflow: hidden scroll;
        padding-right: 0;
    }

    .tab-content {
        height: 100%;
        padding: 4px 6px;
    }

    .tab-title {
        text-align: left;
        background-color: #262626;
    }

    .tab-name {
        padding: 2px 8px;
    }

    .tab-container {
        border: 2px solid #262626;
    }

    .flexr {
        display: flex;
        flex-flow: row;
    }

    .pull-right {
        margin-left: auto;
    }
</style>