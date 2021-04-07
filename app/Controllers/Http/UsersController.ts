import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

export default class UsersController {
  public async index() {
    try {
      const user = await User.all();
      return user;
    } catch (err) {
      return err;
    }
  };

  public async view({ params, request, response }) {
    const user = await User.findOrFail(params.id);

    if (!user) {
      return { error: 'User does not exists.' };
    };

    return user;
  };

  public async store({ request, response }: HttpContextContract) {
    const name = request.input('name');
    const email = request.input('email');
    const password = request.input('password');

    try {
      await User.create({
        name: name,
        email: email,
        password: password,
      })

      return response.status(200)
        .json({
          name,
          email,
        });
    } catch (err) {
      return response.status(400)
        .json(err);
    }
  };

  public async destroy({ params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id);

    try {
      await user.delete();

      return response.status(200);
    } catch (err) {
      return response.status(400)
        .json(err);
    }
  };

  public async update({ params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id);

    user.email = user.email == request.input('name')
      ? user.name
      : request.input('name');

    user.email = user.email == request.input('email')
      ? user.email
      : request.input('email');

    try {
      await User.query()
        .select('*')
        .where('id', params.id)
        .update({
          name: request.input('name'),
          email: request.input('email'),
        });

      return response.status(200)
        .json({
          name: user.name,
          email: user.email,
        });
    } catch (err) {
      return response.status(400)
        .json(err);
    }
  };
};
