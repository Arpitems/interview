let mongoose = require("mongoose");
let randomModel = require("../models/RandomGenerate_Model");
let { Random_Generate } = require("../helper/commonhelper");

// --------------------- Show_RandomGenerate ---------------------
module.exports.Show_RandomGenerate = async (req, res) => {
  try {
    let { recordPerPage, pageNumber,sortTime,sortType,search } = req.body;
    const paginationS = recordPerPage ? parseInt(recordPerPage) : 10;
    const pageS = pageNumber ? parseInt(pageNumber) : 1;
    let dataDetail = await randomModel
      .find({ generateRandom:{ 
        $regex: search,
        $options: "$i"
        }   }).skip((pageS - 1) * paginationS)
      .limit(paginationS).sort( { updatedAt : sortTime ,type:sortType });;
      res.json({
      success: true,
      message: "Data show successfully",
      data: dataDetail,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err,
    });
  }
};
