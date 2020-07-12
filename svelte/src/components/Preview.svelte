<script>
    export let view;
    export let id;
    import { Link } from "svelte-routing";
    import { constants, config, UpdateEnable, DeleteView } from '../store.js';
    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();
    import MdRemove from 'svelte-icons/md/MdRemove.svelte'

    let current_view = {
        id: id,
        ...view
    };
    $: current_view = $config[id];

    function ToggleEnabled (ev) {
      const message_promise = UpdateEnable( id );
      message_promise.then((res) => {
          addNotification({
              text: res,
              position: 'top-center',
          });
      });
    }

    function Delete( id ) {
      const message_promise = DeleteView( id );
        message_promise.then((res) => {
            addNotification({
                text: res,
                position: 'top-center',
            });
        });
    }
</script>

<style>
  .icon {
    width: 32px;
    height: 32px;
  }

  body {
      min-height: 100vh;
      font-family: Roboto, Arial;
      color: #ADAFB6;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #F5F9FF;
    transform:scale(2);
    /* this is just to zoom the pen */
    }
  input[type=checkbox]{
    height: 0;
    width: 0;
    visibility: hidden;
  }

  label {
      cursor: pointer;
      text-indent: -9999px;
      width: 50px;
      height: 25px;
      display: block;
      border-radius: 50px;
      position: relative;
      /* filter: url('#gooey'); */
      
      background: #FF4651;
      box-shadow: 0 8px 16px -1px rgba(255, 70, 81, 0.2);
      transition: .3s ease-in-out;
      transition-delay: .2s;
  }

  label:after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 21px;
      height: 21px;
      background: #fff;
      border-radius: 21px;
      /* transition: 0.3s; */
      animation:expand-left .5s linear forwards;
      

  }

  input:checked+label {
      /* background: #bada55; */
      background: #48EA8B;
      box-shadow: 0 8px 16px -1px rgba(72, 234, 139, 0.8);
      /* animation: jelly-left  */
  }

  input:checked+label:after {
      background:#fff;
      animation:expand-right .5s linear forwards;
      /* left: calc(100% - 5px); */
      /* transform: translateX(-100%); */
  }

  /* label:active:after {
      width: 20px;
  } */
  @-webkit-keyframes expand-right
  {
      0%
      {
          left:2px;
          /* background:white; */
      }
      30%,50%    /* 50% 80% */
      {
          left:2px;
          width:46px;
          
      }
      
      60%
      {
          left:34px;
          width:14px;
      }
      80%
      {
          left:24px;
          width:24px;   
      }
      90%
      {
          left:29px;
          width:19px;  
      }
      100%
      {
          left:27px;
          width:21px;
      }
  }

  @keyframes expand-right
  {
      0%
      {
          left:2px;
          /* background:white; */
      }
      30%,50%    /* 50% 80% */
      {
          left:2px;
          width:46px;
          
      }
      
      60%
      {
          left:34px;
          width:14px;
      }
      80%
      {
          left:24px;
          width:24px;   
      }
      90%
      {
          left:29px;
          width:19px;  
      }
      100%
      {
          left:27px;
          width:21px;
      }
  }

  @-webkit-keyframes expand-left
  {
      0%
      {
          left:27px;
          /* background:white; */
      }
      30%,50%
      {
          left:2px;
          width:46px;
      }
      60%
      {
          right:34px;
          width:14px;
      }
      80%
      {
          right:24px;
          width:24px;   
      }
      90%
      {
          right:29px;
          width:19px;  
      }
      100%
      {
          left:2px;
          width:21px;
      }
  }

  @keyframes expand-left
  {
      0%
      {
          left:27px;
          /* background:white; */
      }
      30%,50%
      {
          left:2px;
          width:46px;
      }
      60%
      {
          right:34px;
          width:14px;
      }
      80%
      {
          right:24px;
          width:24px;   
      }
      90%
      {
          right:29px;
          width:19px;  
      }
      100%
      {
          left:2px;
          width:21px;
      }
  }
</style>

<div class="bg-grey-light border m-4 border-gray-400 rounded-b p-4 leading-normal">

  <div class="flex justify-between">

    <div class="switch mb-4">
      <input bind:checked={current_view['enabled']} on:click={ToggleEnabled} type="checkbox" name="gooey-switch" id="gooey-switch-{id}" />
      <label for="gooey-switch-{id}">On/Off</label>
    </div>

    <div>
      <button on:click={() => { Delete(id) }} class="hover:bg-grey-light">
        <div class="icon bg-white rounded-full h-16 w-16 flex items-center justify-center">
          <MdRemove />
        </div>
      </button>
    </div>
  </div>

  <Link to="/view/{id}">
      <div class="h-32 bg-cover overflow-hidden" style="background-image: url('images/{current_view.background}')" title="Some gauge">
          <div class="h-24 bg-cover overflow-hidden" style="background-image: url('images/{current_view.theme}.png')" title="Some gauge"></div>
      </div>
      <div class="text-gray-700 m-2 text-center font-bold text-xl">
          {current_view.name}
      </div>
      <div class="flex space-x-1">
          {#each current_view.pids as pid}
          <div class="bg-blue-400 rounded-lg text-center w-1/3 text-gray-800">
              {$constants[pid].shortName}
          </div>
          {/each}
      </div>
  </Link>
</div>
