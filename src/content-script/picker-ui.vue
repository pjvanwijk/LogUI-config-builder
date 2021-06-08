<template>
    <div class="container fixed-top bg-light" id="logui-picker-ui">
        <div class="row">
            <h1>Selector Options</h1>
            <h2>Specificity: {{specificity}}</h2>
        </div>
        <div class="row">
            <h2>Events</h2>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                    Add listener
                </button>
                <div class="dropdown-menu">
                    <a v-for="event in events" :key="event" class="dropdown-item" href="#">{{event}}</a>
                </div>
            </div>
        </div>
        <div class="row">
            <button class="btn btn-primary">Done</button>
            <button class="btn btn-danger">Cancel</button>
        </div>         
    </div>
</template>

<style scoped lang="css" src="bootstrap/dist/css/bootstrap.css"></style>

<script>
export default {
    data() {
        return {
            specificity: 42,
            events: ['click', 'mouseover', 'mouseexit']
        };
    }
}
</script>
