import OtherDayPicker from '@/components/OtherDayPicker'
import React, { ReactElement } from 'react'

async function Page({ params }: PageProps<'/dag/[dato]'>): Promise<ReactElement> {
  return (
    <div className="grid h-[calc(100svh-4rem)] grid-cols-1 grid-rows-[calc(70svh-4rem)_30svh]">
      <div className="flex flex-col">
        <div className="flex">
          <h2 className="shrink-0 p-4 text-xl">Badstuer i dag</h2>
          <OtherDayPicker activeDate={(await params).dato} from={0} />
        </div>
      </div>
      hey
    </div>
  )
}

export default Page
