class Api::V1::UsersController < ApplicationController
  before_action :authorize_admin!

  # GET /api/v1/users
  def index
    @users = User.all.order(created_at: :desc)
    render json: @users.map { |u| user_as_json(u) }
  end

  # POST /api/v1/users
  def create
    @user = User.new(user_params)
    if @user.save
      render json: user_as_json(@user), status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:id
  def destroy
    @user = User.find(params[:id])
    if @user == current_user
      render json: { errors: "No puedes eliminarte a ti mismo" }, status: :unprocessable_entity
    else
      @user.destroy
      head :no_content
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :role)
  end

  def authorize_admin!
    unless current_user.admin?
      render json: { error: "Acceso denegado. Se requiere rol de Administrador." }, status: :forbidden
    end
  end

  def user_as_json(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }
  end
end