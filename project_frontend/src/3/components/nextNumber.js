export const nextNumber = (question_number_url, type, org) => {
  if (question_number_url == 0){
    return {"question_number_url": 1, "type": "test"};
  }
  if (org == "fda" || "favt_ul" || "fazt"){
    if(type == "test" && question_number_url < 49){
      return {"question_number_url": question_number_url+1, "type": "test"};
    }
    else if(type == "test" && question_number_url == 49){
      return {"question_number_url": 1, "type": "tem"};
    }
    else if(type == "tem" && question_number_url < 3){
      return {"question_number_url": question_number_url+1, "type": "tem"};
    }
    else if(type == "tem" && question_number_url == 3){
      return {"question_number_url": 1, "type": "prakt"};
    }
    else if(type == "prakt" && question_number_url < 2){
      return {"question_number_url": question_number_url+1, "type": "prakt"};
    }
    else if(type == "tem" && question_number_url == 2){
      return {"type": "end"};
    }
  }
  if (org == "favt_mos"){
    
  }
}