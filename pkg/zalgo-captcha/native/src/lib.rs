use neon::prelude::*;
use std::str;
use base64::encode;


// fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
//     Ok(cx.string("hello node"))
// }


extern crate captcha;

use captcha::{gen, Difficulty};
// use std::io::BufReader;
// use std::io::prelude::*;
// use std::fs::File;

// fn create_captcha(d: Difficulty) -> Result<(String, Vec<u8>), String> {
//   gen(d).as_tuple().ok_or("Failed while generating new Captcha".to_string())
//}


// fn create_v1(mut cx: FunctionContext) -> JsResult<JsString> {
//     let s = gen(Difficulty::Easy).as_base64().expect("Error.");
//     Ok(cx.string(s.as_str()))
// }


fn create(mut cx: FunctionContext) -> JsResult<JsArray> {
  let array: Handle<JsArray> = JsArray::new(&mut cx, 1);
  let captcha = gen(Difficulty::Hard);

  // let image = captcha.as_base64().unwrap();
  let (solution, png) = captcha.as_tuple().unwrap();
  let image = encode(png);
  let image_string = cx.string(image.as_str());
  let solution_string = cx.string(solution);

  array.set(&mut cx, 0, image_string)?;
  array.set(&mut cx, 1, solution_string)?;
  
  Ok(array)
}
register_module!(mut cx, {
    // cx.export_function("hello", hello);
    cx.export_function("create", create)
});

