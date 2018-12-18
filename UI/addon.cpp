#include <napi.h>

using namespace Napi;

Value SetXPosition(const CallbackInfo& info) {
  Env env = info.Env();
  
  if(info.Length() != 1) {
    TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsNumber()) {
    TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  double arg0 = info[0].As<Number>().DoubleValue();

  Number ox = Number::New(env, arg0 / 2.0);
  return ox;
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "add"),
              Function::New(env, SetXPosition));
  return exports;
}

NODE_API_MODULE(addon, Init)