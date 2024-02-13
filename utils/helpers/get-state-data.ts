import { STATE_CITY_DATA } from "../data"
import { getObjectKeys } from "./object"

// type SELECTED = string | undefined

// const selected: SELECTED = ''

export const getStateData = () => {
    return STATE_CITY_DATA.map(state => {
      return {
        label: state.name,
        value: state.name
      }
    })
}

export const getCityByStateName = (stateName: string) => {
    return STATE_CITY_DATA.filter(state => state.name.toLowerCase() === stateName.toLowerCase())[0]?.cities?.map((city) => {
      return {
        label: city,
        value: city
      }
    })
}