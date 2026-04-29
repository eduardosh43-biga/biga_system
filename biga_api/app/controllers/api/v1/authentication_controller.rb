class Api::V1::AuthenticationController < ApplicationController
  # IMPORTANTE: Aquí le decimos al portero que nos deje entrar SIN token
  # El raise: false es para evitar errores si Rails se confunde con el orden de carga
  skip_before_action :authenticate_request, only: [:login], raise: false

  def login
    @user = User.find_by(email: params[:email])

    if @user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      render json: { 
        token: token, 
        user: { 
          id: @user.id,
          name: @user.name, 
          role: @user.role 
        } 
      }, status: :ok
    else
      render json: { error: 'Email o contraseña incorrectos' }, status: :unauthorized
    end
  end
end