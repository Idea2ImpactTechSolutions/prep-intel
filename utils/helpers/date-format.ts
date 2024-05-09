import moment from "moment";


  export const formatRMDatePicker = (date: any) => {
    // Format the date as 'YYYY-MM-DD'
    const day = date?.day?.toString()?.padStart(2, '0');
    const month = (date?.month?.number)?.toString()?.padStart(2, '0');
    const year = date?.year;
  
    return `${year}-${month}-${day}`;
  };

  export const dateTimeDifference = (create_date: string): string => {
    const secondsDifference = moment().diff(moment(create_date), 'seconds');
    
    if (secondsDifference >= 24 * 60 * 60) {
      const daysDifference = Math.floor(secondsDifference / (24 * 60 * 60));
      return daysDifference > 1 ? ` ${daysDifference} days` : `${daysDifference} day`;
    } else if (secondsDifference >= 60 * 60) {
      const hoursDifference = Math.floor(secondsDifference / (60 * 60));
      return `${hoursDifference} hr`;
    } else if (secondsDifference >= 60) {
      const minutesDifference = Math.floor(secondsDifference / 60);
      return `${minutesDifference} min`;
    } else {
      return `${secondsDifference} sec`;
    }
  };