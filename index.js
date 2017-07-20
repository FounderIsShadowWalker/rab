// import React from 'react';
// import { render } from 'react-dom';
// import App from './src/App';
//
// import './node_modules/normalize.css/normalize.css';
// //import './css/global.css'
//
// render((<App />), document.querySelector('#root'));







import React, { Component } from 'react';
import rab, {connect, createModel, put, call} from 'rabjs';
import { Router, Route } from 'rabjs/router';

function stop(time) {
    return new Promise((res,rej)=>{
        setTimeout(function() {res();},2000);
    });
}

const app = rab();

let count = createModel({
    namespace: 'count',
    state: {
        num:0,
        loading:false
    },
    reducers: {
        add(state,action) {
            return Object.assign({},state,{num:state.num + 1})
        },
        minus(state) { return Object.assign({},state,{num:state.num - 1})  },
        asyncAdd(state,action) { return Object.assign({},state,{num:state.num + action.payload})  },
        asyncMinus(state,action) { return Object.assign({},state,{num:state.num + action.payload})  },
        asyncNewApi:{
            start(state,action){
                return Object.assign({},state,{loading:true});
            },
            next(state,action){
                return Object.assign({},state,{num:state.num + action.payload})
            },
            throw(state,action){
                return Object.assign({},state,{num:state.num + action.payload})
            },
            finish(state,action){
                return Object.assign({},state,{loading:false});
            }
        }
    },
    actions:{
        //高阶异步action 可以获取全局的state，put
        asyncAdd: (a, b, c) => async ({getState, dispatch,call}) => {
            console.log('----->', getState(), dispatch)
            await stop();
            return 100;
        },
        //正常异步action
        async asyncMinus() {
            await stop();
            return -100;
        },
        async asyncNewApi() {
            await stop();
            return -100;
        }
    },
    subscriptions:{
        init({history, dispatch}){
            history.listen((location) => {
                console.log('init------------>',location)
            })
        }
    }
})

app.addModel(count);

const App = connect(({ count }) => ({
    count
}))((props) => {
    return (
        <div>
            <h2>{ props.count.num }</h2>
            <h2>{ !props.count.loading?'finish':'loading' }</h2>
            <button key="add" onClick={() => { put({type: 'count.add' ,payload:{a:1}});}}>+</button>
            <button key="minus" onClick={() => { props.dispatch({type: 'count.minus' }); }}>-</button>
            <button key="asyncadd" onClick={() => { props.dispatch(count.actions.asyncAdd()); }}>ASYNC ADD</button>
            <button key="asyncminus" onClick={() => { put({type: 'count.asyncMinus',payload:{a:1,n:2} }); }}>ASYNC Minus</button>
            <button key="asyncNewApi" onClick={() => {put({type: 'count.asyncNewApi'}); }}>asyncNewApi</button>
        </div>
    );
});

// 4. Add Router
app.router(({ history }) => {
    return (
        <Router history={history}>
            <Route path="/" component={App} />
        </Router>
    );
});

// 5. Start
app.start('#root');




