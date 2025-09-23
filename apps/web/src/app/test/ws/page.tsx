"use client"
import React from 'react'
import { useTRPC } from "@/trpc/client";
import { useMutation } from '@tanstack/react-query';




function page() {
    const trpc = useTRPC();
    const {mutate} = useMutation(trpc.chatRouter.sendPost.mutationOptions())
    const { status, data } = trpc.chatRouter.onPostAdd.useSubscription(
      { lastEventId: null },
      {
        onData: (data) => {
          console.log("receive data from websocket is ==========>", data);
        },
      }
    );

    function handleSend(){
      console.log("web socket listner")
      mutate({
        author : "meekail",
        content : "hello world"
      },{
        onSuccess : (data)=>{
          console.log("websocke successfully integrate ho gya",data)
        }
      })
    }
  return (
    <div>
      <h1>Websocket hello world</h1>
      <button onClick={handleSend} type='button'>Send</button>
    </div>
  )
}

export default page
