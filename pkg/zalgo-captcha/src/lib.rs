use neon::prelude::*;
use base64::encode;
use captcha::{gen, Difficulty};

fn create(mut cx: FunctionContext) -> JsResult<JsArray> {
  let result: Handle<JsArray> = JsArray::new(&mut cx, 2);
  let captcha = gen(Difficulty::Hard);

  let (solution, buffer) = captcha.as_tuple().unwrap();
  let image_string = cx.string(encode(buffer).as_str());
  let solution_string = cx.string(solution);

  result.set(&mut cx, 0, image_string)?;
  result.set(&mut cx, 1, solution_string)?;

  Ok(result)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("create", create)?;
    Ok(())
}
